#!/usr/bin/env node

// Quick script to generate 20 batches of 3 questions each (60 questions)
require('dotenv').config({ path: '../.env' });

const { spawn } = require('child_process');

async function generateBatch(batchNumber) {
    return new Promise((resolve, reject) => {
        console.log(`🎯 Quick batch ${batchNumber} (3 questions)...`);
        
        const child = spawn('node', [
            'question-generator.cjs', 
            'hebrew-json-enhanced', 
            'restatement', 
            'hard', 
            '3', 
            '--premium'
        ], {
            stdio: 'inherit',
            cwd: __dirname
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Batch ${batchNumber} completed`);
                resolve();
            } else {
                console.log(`❌ Batch ${batchNumber} failed`);
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
    const totalBatches = 20; // Generate 60 more questions
    let successfulBatches = 0;

    for (let i = 1; i <= totalBatches; i++) {
        try {
            await generateBatch(i);
            successfulBatches++;
            
            // Short wait between batches
            if (i < totalBatches) {
                console.log(`⏳ Waiting 3 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (error) {
            console.error(`❌ Batch ${i} failed:`, error.message);
        }
    }

    console.log(`\n📊 Quick batch complete: ${successfulBatches}/${totalBatches} successful`);
    console.log(`📝 Estimated questions generated: ${successfulBatches * 3}`);
}

main().catch(console.error);