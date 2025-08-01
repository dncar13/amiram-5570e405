#!/usr/bin/env node

// Script to generate hard-level restatement questions one by one
require('dotenv').config({ path: '../.env' });

const { spawn } = require('child_process');

async function generateSingleQuestion(questionNumber) {
    return new Promise((resolve, reject) => {
        console.log(`🎯 Generating question ${questionNumber}...`);
        
        const child = spawn('node', [
            'question-generator.cjs', 
            'hebrew-json-enhanced', 
            'restatement', 
            'hard', 
            '1', 
            '--premium'
        ], {
            stdio: 'inherit',
            cwd: __dirname
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Question ${questionNumber} completed successfully`);
                resolve();
            } else {
                console.log(`❌ Question ${questionNumber} failed with code ${code}`);
                reject(new Error(`Question ${questionNumber} failed`));
            }
        });

        child.on('error', (error) => {
            console.error(`❌ Error generating question ${questionNumber}:`, error);
            reject(error);
        });
    });
}

async function main() {
    const targetQuestions = 50; // Let's start with 50 questions for now
    
    console.log(`🚀 Starting generation of ${targetQuestions} hard-level restatement questions`);
    console.log(`📊 Generating 1 question at a time to avoid JSON parsing issues`);

    let successfulQuestions = 0;
    let failedQuestions = 0;

    for (let i = 1; i <= targetQuestions; i++) {
        try {
            await generateSingleQuestion(i);
            successfulQuestions++;
            
            // Wait 2 seconds between questions to avoid rate limits
            if (i < targetQuestions) {
                console.log(`⏳ Waiting 2 seconds before next question...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error(`❌ Question ${i} failed:`, error.message);
            failedQuestions++;
            
            // Continue with next question even if one fails
            console.log(`🔄 Continuing with next question...`);
        }
    }

    console.log(`\n📊 Generation Summary:`);
    console.log(`✅ Successful questions: ${successfulQuestions}`);
    console.log(`❌ Failed questions: ${failedQuestions}`);
    
    if (successfulQuestions > 0) {
        console.log(`\n💡 Check the questions-hebrew/restatement/hard/ directory for your generated questions`);
        console.log(`📁 Each question is saved in a separate batch file with timestamp`);
    }
}

// Run the generation
main().catch(console.error);