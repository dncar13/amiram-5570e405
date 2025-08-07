#!/usr/bin/env node

/**
 * BigQuery Event Monitoring Script
 * Runs the events validation query and sends alerts for issues
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-ga4-project-id',
  datasetId: process.env.GA4_DATASET_ID || 'analytics_XXXXXXXXXX',
  slackWebhook: process.env.SLACK_WEBHOOK_URL,
  emailAlert: process.env.ALERT_EMAIL,
  dryRun: process.env.DRY_RUN === 'true',
};

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: CONFIG.projectId,
});

/**
 * Load and prepare the validation SQL query
 */
function loadValidationQuery() {
  const sqlPath = path.join(__dirname, 'events_validation.sql');
  let sql = fs.readFileSync(sqlPath, 'utf8');
  
  // Replace template variables
  sql = sql.replace(/\{project_id\}/g, CONFIG.projectId);
  sql = sql.replace(/\{dataset_id\}/g, CONFIG.datasetId);
  
  return sql;
}

/**
 * Run the validation query and return results
 */
async function runValidationQuery() {
  console.log('🔍 Running events validation query...');
  
  const sql = loadValidationQuery();
  
  if (CONFIG.dryRun) {
    console.log('🧪 DRY RUN MODE - Query would be:');
    console.log(sql.substring(0, 500) + '...');
    return [];
  }
  
  try {
    const [rows] = await bigquery.query({
      query: sql,
      location: 'US', // Adjust based on your dataset location
    });
    
    console.log(`✅ Query completed. Found ${rows.length} validation results.`);
    return rows;
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    throw error;
  }
}

/**
 * Analyze validation results and categorize issues
 */
function analyzeResults(results) {
  const analysis = {
    summary: [],
    errors: [],
    warnings: [],
    totalEvents: 0,
    totalRevenue: 0,
  };
  
  results.forEach(row => {
    const { validation_type, status, event_name, total_events, total_value, details } = row;
    
    if (validation_type === 'SUMMARY') {
      analysis.summary.push(row);
      analysis.totalEvents += total_events || 0;
      analysis.totalRevenue += total_value || 0;
    } else if (status?.startsWith('ERROR')) {
      analysis.errors.push(row);
    } else if (status?.startsWith('WARNING')) {
      analysis.warnings.push(row);
    }
  });
  
  return analysis;
}

/**
 * Format results for human-readable output
 */
function formatResults(analysis) {
  let output = ['📊 GA4 Event Validation Report', '=' .repeat(40), ''];
  
  // Summary
  output.push('📈 **Summary**');
  analysis.summary.forEach(row => {
    output.push(
      `• ${row.event_name}: ${row.total_events} events, ` +
      `${row.unique_transactions} unique transactions, ` +
      `₪${Math.round(row.total_value || 0)} revenue`
    );
  });
  output.push(`• **Total**: ${analysis.totalEvents} events, ₪${Math.round(analysis.totalRevenue)} revenue`);
  output.push('');
  
  // Errors
  if (analysis.errors.length > 0) {
    output.push('🚨 **CRITICAL ISSUES**');
    analysis.errors.forEach(error => {
      output.push(`• ${error.validation_type}: ${error.status}`);
      if (error.details) {
        output.push(`  Details: ${error.details.substring(0, 200)}...`);
      }
    });
    output.push('');
  }
  
  // Warnings
  if (analysis.warnings.length > 0) {
    output.push('⚠️ **Warnings**');
    analysis.warnings.forEach(warning => {
      output.push(`• ${warning.validation_type}: ${warning.status}`);
      if (warning.details) {
        output.push(`  Details: ${warning.details.substring(0, 150)}...`);
      }
    });
    output.push('');
  }
  
  // Overall status
  const overallStatus = analysis.errors.length > 0 ? '🚨 CRITICAL' : 
                       analysis.warnings.length > 0 ? '⚠️ WARNING' : '✅ HEALTHY';
  output.push(`**Overall Status**: ${overallStatus}`);
  output.push(`**Generated**: ${new Date().toISOString()}`);
  
  return output.join('\n');
}

/**
 * Send Slack notification
 */
async function sendSlackAlert(message, isError = false) {
  if (!CONFIG.slackWebhook) {
    console.log('⏭️ Slack webhook not configured, skipping notification');
    return;
  }
  
  const color = isError ? '#FF0000' : '#FFA500';
  const emoji = isError ? '🚨' : '⚠️';
  
  const payload = {
    text: `${emoji} GA4 Event Validation Alert`,
    attachments: [{
      color: color,
      title: 'Event Validation Report',
      text: message.substring(0, 2000), // Slack has text limits
      footer: 'Amiram Analytics Monitoring',
      ts: Math.floor(Date.now() / 1000)
    }]
  };
  
  try {
    const response = await fetch(CONFIG.slackWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✅ Slack notification sent');
    } else {
      console.error('❌ Failed to send Slack notification:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending Slack notification:', error.message);
  }
}

/**
 * Save results to file for historical tracking
 */
function saveResults(analysis, formattedResults) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsDir = path.join(__dirname, 'results');
  
  // Ensure results directory exists
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  // Save detailed JSON results
  const jsonPath = path.join(resultsDir, `validation-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    config: CONFIG,
    analysis: analysis
  }, null, 2));
  
  // Save formatted report
  const reportPath = path.join(resultsDir, `report-${timestamp}.txt`);
  fs.writeFileSync(reportPath, formattedResults);
  
  console.log(`💾 Results saved to: ${jsonPath}`);
  console.log(`📄 Report saved to: ${reportPath}`);
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting GA4 event validation monitoring...');
  console.log(`📊 Project: ${CONFIG.projectId}`);
  console.log(`📊 Dataset: ${CONFIG.datasetId}`);
  
  try {
    // Run validation query
    const results = await runValidationQuery();
    
    // Analyze results
    const analysis = analyzeResults(results);
    
    // Format for output
    const formattedResults = formatResults(analysis);
    
    // Print to console
    console.log('\n' + formattedResults);
    
    // Save results
    saveResults(analysis, formattedResults);
    
    // Send alerts if needed
    const hasErrors = analysis.errors.length > 0;
    const hasWarnings = analysis.warnings.length > 0;
    
    if (hasErrors || hasWarnings) {
      await sendSlackAlert(formattedResults, hasErrors);
    }
    
    // Exit with appropriate code
    const exitCode = hasErrors ? 1 : hasWarnings ? 2 : 0;
    console.log(`\n🎯 Validation complete. Exit code: ${exitCode}`);
    process.exit(exitCode);
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    
    if (CONFIG.slackWebhook) {
      await sendSlackAlert(`❌ GA4 validation script failed: ${error.message}`, true);
    }
    
    process.exit(3);
  }
}

// Handle command line arguments
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📊 GA4 Event Validation Monitor

Usage: node monitor-events.js [options]

Options:
  --dry-run         Show what would be done without executing
  --help, -h        Show this help message

Environment Variables:
  GOOGLE_CLOUD_PROJECT_ID    Google Cloud project ID
  GA4_DATASET_ID            GA4 BigQuery dataset ID
  SLACK_WEBHOOK_URL         Slack webhook for notifications
  ALERT_EMAIL              Email for critical alerts
  DRY_RUN=true             Enable dry run mode

Exit Codes:
  0  Success (no issues)
  1  Critical errors detected
  2  Warnings detected
  3  Script execution failed
    `);
    process.exit(0);
  }
  
  if (args.includes('--dry-run')) {
    CONFIG.dryRun = true;
  }
  
  main();
}