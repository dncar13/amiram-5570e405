# GA4 → BigQuery Export Setup Guide

This guide walks you through enabling continuous export from Google Analytics 4 to BigQuery and setting up automated validation queries for duplicate event detection.

## Prerequisites

- Google Analytics 4 property with admin access
- Google Cloud Platform project with billing enabled
- BigQuery API enabled in your GCP project
- Appropriate IAM permissions (Analytics Admin, BigQuery Admin)

## Step 1: Enable GA4 → BigQuery Export

### 1.1 Access Admin Settings
1. Open Google Analytics 4
2. Click **Admin** (gear icon in bottom left)
3. In the **Property** column, click **BigQuery Linking**

### 1.2 Create BigQuery Link
1. Click **Link** button
2. Select your Google Cloud project
3. Choose data location (same region as your BigQuery datasets)
4. Configure export settings:
   - **Daily export**: ✅ Enable (exports once per day)
   - **Streaming export**: ✅ Enable for real-time data (recommended)
   - **Include advertising identifiers**: Choose based on privacy policy
   - **Export frequency**: Daily (free) or Streaming (paid)

### 1.3 Select Events to Export
1. Choose **All events** for comprehensive tracking
2. Or select specific events if you want to limit costs:
   - `purchase`
   - `refund` 
   - `premium_purchase`
   - `begin_checkout`
   - `sign_up`
   - `login`

### 1.4 Complete Setup
1. Click **Next** → **Submit**
2. Wait for initial export (can take up to 48 hours)
3. Verify data appears in BigQuery console

## Step 2: BigQuery Dataset Structure

Once export is enabled, GA4 creates a dataset with this structure:

```
analytics_XXXXXXXXX/               # Dataset (X = property ID)
├── events_YYYYMMDD               # Daily tables
├── events_intraday_YYYYMMDD      # Streaming tables (current day)
└── pseudonymous_users_YYYYMMDD   # User data tables
```

## Step 3: Set Up Validation Queries

### 3.1 Update SQL Template
1. Open `events_validation.sql`
2. Replace these placeholders:
   ```sql
   DECLARE project_id STRING DEFAULT 'your-ga4-project-id';
   DECLARE dataset_id STRING DEFAULT 'analytics_XXXXXXXXXX';
   ```

### 3.2 Test the Query
1. Open BigQuery console
2. Create new query
3. Paste the contents of `events_validation.sql`
4. Run query to verify it works
5. Save as a scheduled query (optional)

### 3.3 Expected Results
The query returns validation results with these types:
- `SUMMARY`: Overview of event counts and totals
- `DUPLICATE_TRANSACTIONS`: Events with same transaction_id
- `MISSING_TRANSACTION_ID`: Purchase events without transaction_id
- `INVALID_CHECKSUM`: Events with malformed checksums
- `ORPHANED_REFUND`: Refunds without corresponding purchases

## Step 4: Automated Monitoring

### 4.1 Create Scheduled Query
1. In BigQuery, click **Schedule** after running validation query
2. Set schedule: Daily at 9:00 AM
3. Destination: Create new table for results
4. Configure notifications for failures

### 4.2 Create Data Studio Dashboard
1. Connect BigQuery validation results to Data Studio
2. Create charts for:
   - Daily event counts
   - Duplicate detection alerts
   - Revenue trends
   - Error counts by type

### 4.3 Set Up Alerting
```sql
-- Create view for alerts
CREATE VIEW `your-project.analytics.event_quality_alerts` AS
SELECT 
  validation_type,
  COUNT(*) as alert_count,
  CURRENT_TIMESTAMP() as check_time
FROM `your-project.analytics.daily_validation_results`
WHERE status LIKE 'ERROR%'
GROUP BY validation_type;
```

## Step 5: Cost Management

### 5.1 BigQuery Costs
- **Daily export**: Free (includes up to 1 million events/day)
- **Streaming export**: $0.10 per GB of streamed data
- **Query costs**: $5 per TB of data processed
- **Storage costs**: $0.02 per GB per month

### 5.2 Cost Optimization Tips
1. **Partition tables** by date for efficient queries
2. **Use LIMIT** clauses when testing queries  
3. **Select specific columns** instead of SELECT *
4. **Use date filters** to limit data range
5. **Cache results** for frequently run queries

### 5.3 Monitor Usage
```sql
-- Query to monitor BigQuery costs
SELECT
  job_id,
  creation_time,
  total_bytes_processed / 1024 / 1024 / 1024 as gb_processed,
  total_bytes_processed / 1024 / 1024 / 1024 * 5 as estimated_cost_usd
FROM `region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time > DATETIME_SUB(CURRENT_DATETIME(), INTERVAL 7 DAY)
ORDER BY total_bytes_processed DESC
LIMIT 10;
```

## Step 6: Data Validation Checklist

### 6.1 Daily Checks
- [ ] Events are flowing to BigQuery (check `events_YYYYMMDD` tables)
- [ ] No ERROR-level issues in validation results
- [ ] Transaction counts match expected business volumes
- [ ] Revenue totals align with payment system reports

### 6.2 Weekly Checks  
- [ ] Review WARNING-level issues and trends
- [ ] Verify checksum implementation is working
- [ ] Check for orphaned refunds
- [ ] Monitor storage costs and optimize queries

### 6.3 Monthly Checks
- [ ] Full data quality audit across all events
- [ ] Review and update validation SQL if needed
- [ ] Optimize BigQuery performance and costs
- [ ] Update dashboard and alerting rules

## Step 7: Troubleshooting

### 7.1 Common Issues

**No data in BigQuery after 48 hours:**
- Verify BigQuery API is enabled
- Check IAM permissions for the linking service account
- Ensure the GCP project has billing enabled

**High query costs:**
- Add date partitioning to your queries
- Use `_TABLE_SUFFIX` filters to limit date range
- Avoid SELECT * queries

**Missing transaction_id values:**
- Check client-side analytics implementation
- Verify transaction_id is being set correctly
- Update validation SQL to handle legacy data

### 7.2 Support Resources
- [GA4 BigQuery Export Documentation](https://support.google.com/analytics/answer/9358801)
- [BigQuery Cost Optimization](https://cloud.google.com/bigquery/docs/best-practices-costs)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)

## Step 8: Security Considerations

### 8.1 Data Privacy
- Ensure BigQuery export complies with GDPR/CCPA
- Configure data retention policies
- Implement appropriate access controls

### 8.2 Access Control
```sql
-- Grant read access to analytics team
GRANT `roles/bigquery.dataViewer` 
ON `your-project.analytics_XXXXXXXXX` 
TO 'analytics-team@your-domain.com';

-- Grant query access for validation scripts
GRANT `roles/bigquery.jobUser` 
ON `your-project` 
TO 'analytics-service@your-domain.com';
```

---

## Implementation Status

- [ ] GA4 BigQuery export enabled
- [ ] Validation SQL tested and working
- [ ] Scheduled queries set up
- [ ] Monitoring dashboard created
- [ ] Cost alerts configured
- [ ] Team training completed

**Setup completed by:** [Name] on [Date]  
**Next review:** [Date + 1 month]