#!/usr/bin/env node

// Script to generate 200 hard-level restatement questions in small batches
require('dotenv').config({ path: '../.env' });

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

async function generateBatch(batchNumber, questionsPerBatch = 10) {
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

async function main() {
    const targetQuestions = 200;
    const questionsPerBatch = 10;
    const totalBatches = Math.ceil(targetQuestions / questionsPerBatch);

    console.log(`🚀 Starting generation of ${targetQuestions} hard-level restatement questions`);
    console.log(`📊 Generating ${questionsPerBatch} questions per batch`);
    console.log(`🔢 Total batches needed: ${totalBatches}`);

    let successfulBatches = 0;
    let failedBatches = 0;

    for (let i = 1; i <= totalBatches; i++) {
        try {
            await generateBatch(i, questionsPerBatch);
            successfulBatches++;
            
            // Wait 3 seconds between batches to avoid rate limits
            if (i < totalBatches) {
                console.log(`⏳ Waiting 3 seconds before next batch...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
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
    
    if (successfulBatches > 0) {
        console.log(`\n💡 Check the questions-hebrew/restatement/hard/ directory for your generated questions`);
    }
}

// Run the batch generation
main().catch(console.error);