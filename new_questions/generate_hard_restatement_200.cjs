#!/usr/bin/env node

// Enhanced script to generate 200 hard-level restatement questions in small batches
// Prevents overwriting by using timestamp-based filenames
require('dotenv').config({ path: '../.env' });

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

async function generateBatch(batchNumber, questionsPerBatch = 3) {
    return new Promise((resolve, reject) => {
        console.log(`🎯 Starting batch ${batchNumber} (${questionsPerBatch} questions)...`);
        
        const child = spawn('node', [
            'question-generator.cjs', 
            'hebrew-json-enhanced', 
            'restatement', 
            'hard', 
            questionsPerBatch.toString(), 
            '--premium'
        ], {
            stdio: 'inherit',
            cwd: __dirname
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Batch ${batchNumber} completed successfully`);
                resolve();
            } else {
                console.log(`❌ Batch ${batchNumber} failed with code ${code}`);
                reject(new Error(`Batch ${batchNumber} failed`));
            }
        });

        child.on('error', (error) => {
            console.error(`❌ Error in batch ${batchNumber}:`, error);
            reject(error);
        });
    });
}

async function countExistingQuestions() {
    const hardDir = path.join(__dirname, 'questions-hebrew/restatement/hard');
    try {
        const files = await fs.readdir(hardDir);
        let totalQuestions = 0;
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(hardDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                const data = JSON.parse(content);
                if (data.metadata && data.metadata.type === 'restatement' && data.metadata.difficulty === 'hard') {
                    totalQuestions += data.metadata.count || 0;
                    console.log(`📄 Found ${data.metadata.count} questions in ${file}`);
                }
            }
        }
        return totalQuestions;
    } catch (error) {
        console.log(`📁 Hard restatement directory not found or empty, starting from 0`);
        return 0;
    }
}

async function main() {
    console.log(`🚀 Starting generation of hard-level restatement questions`);
    
    // Count existing questions
    const existingQuestions = await countExistingQuestions();
    console.log(`📊 Found ${existingQuestions} existing hard restatement questions`);
    
    const targetQuestions = 200;
    const questionsPerBatch = 3; // Small batches to avoid API issues
    const questionsNeeded = Math.max(0, targetQuestions - existingQuestions);
    
    if (questionsNeeded === 0) {
        console.log(`🎉 Target already reached! You have ${existingQuestions} questions.`);
        return;
    }
    
    const totalBatches = Math.ceil(questionsNeeded / questionsPerBatch);
    
    console.log(`📝 Need ${questionsNeeded} more questions`);
    console.log(`📊 Generating ${questionsPerBatch} questions per batch`);
    console.log(`🔢 Total batches needed: ${totalBatches}`);

    let successfulBatches = 0;
    let failedBatches = 0;

    for (let i = 1; i <= totalBatches; i++) {
        try {
            await generateBatch(i, questionsPerBatch);
            successfulBatches++;
            
            // Wait 5 seconds between batches to avoid rate limits
            if (i < totalBatches) {
                console.log(`⏳ Waiting 5 seconds before next batch...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        } catch (error) {
            console.error(`❌ Batch ${i} failed:`, error.message);
            failedBatches++;
            
            // Continue with next batch even if one fails
            console.log(`🔄 Continuing with next batch...`);
        }
    }

    console.log(`\n📊 Generation Summary:`);
    console.log(`✅ Successful batches: ${successfulBatches}`);
    console.log(`❌ Failed batches: ${failedBatches}`);
    console.log(`📝 Estimated questions generated: ${successfulBatches * questionsPerBatch}`);
    console.log(`🎯 Total estimated questions: ${existingQuestions + (successfulBatches * questionsPerBatch)}`);
    
    if (successfulBatches > 0) {
        console.log(`\n💡 Check the questions-hebrew/restatement/hard/ directory for your generated questions`);
        console.log(`📋 Each batch is saved in a separate timestamped file to prevent overwriting`);
    }
    
    // Final count
    const finalCount = await countExistingQuestions();
    console.log(`\n🔍 Final verification: ${finalCount} total hard restatement questions found`);
}

// Run the batch generation
main().catch(console.error);