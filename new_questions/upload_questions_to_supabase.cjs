#!/usr/bin/env node

// Script to upload generated Hebrew questions to Supabase
require('dotenv').config({ path: '../.env' });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase setup - using environment variables from parent directory
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Transform questions from our format to Supabase format
function transformQuestionForDB(question, batchId) {
    const isPremium = question.tags?.includes('premium') || false;
    
    // Generate UUID
    const generatedId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    
    // Create metadata object
    const metadata = {
        custom_id: question.id,
        tags: question.tags || [],
        is_set_based: false,
        set_id: null,
        set_number: null,
        set_order: null,
        set_type: question.type,
        is_premium_set: isPremium,
        examples: question.examples || null,
        grammarRule: question.grammarRule || null,
        commonMistakes: question.commonMistakes || null,
        usageTip: question.usageTip || null,
        enhancedFeatures: question.enhancedFeatures || null
    };
    
    return {
        id: generatedId,
        type: question.type,
        question_text: question.text,
        answer_options: question.options,
        correct_answer: question.correctAnswer.toString(),
        explanation: question.explanation,
        difficulty: question.difficulty,
        is_premium: isPremium,
        ai_generated: true,
        generation_model: 'claude-sonnet-4-20250514',
        batch_id: batchId,
        quality_score: question.difficulty === 'hard' ? 95 : question.difficulty === 'medium' ? 85 : 75,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: metadata
    };
}

async function uploadQuestionBatch(questions, fileDescription) {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const errors = [];
    let uploadedCount = 0;

    console.log(`📤 Starting upload of ${questions.length} questions from ${fileDescription}`);
    console.log(`🔖 Batch ID: ${batchId}`);

    // Check for existing questions with the same custom IDs
    const customIds = questions.map(q => q.id);
    const { data: existingQuestions, error: checkError } = await supabase
        .from('questions')
        .select('metadata')
        .not('metadata->custom_id', 'is', null);

    if (checkError) {
        console.error('❌ Error checking existing questions:', checkError);
        return { success: false, uploadedCount: 0, errors: [checkError.message] };
    }

    // Extract existing custom IDs
    const existingCustomIds = new Set();
    existingQuestions?.forEach(q => {
        if (q.metadata && typeof q.metadata === 'object' && 'custom_id' in q.metadata) {
            existingCustomIds.add(q.metadata.custom_id);
        }
    });

    console.log(`🔍 Found ${existingCustomIds.size} existing questions with custom IDs`);

    // Filter out questions that already exist
    const questionsToUpload = questions.filter(q => {
        const exists = existingCustomIds.has(q.id);
        if (exists) {
            errors.push(`Question ${q.id}: already exists in database`);
            console.log(`⚠️ Skipping existing question: ${q.id}`);
        }
        return !exists;
    });

    if (questionsToUpload.length === 0) {
        console.log(`ℹ️ All questions from ${fileDescription} already exist in database`);
        return { success: false, uploadedCount: 0, errors: ['All questions already exist'], skipped: true };
    }

    console.log(`📤 Uploading ${questionsToUpload.length} new questions (${errors.length} duplicates skipped)`);

    // Process questions one by one
    for (const [index, question] of questionsToUpload.entries()) {
        try {
            const transformedQuestion = transformQuestionForDB(question, batchId);
            
            const { error } = await supabase
                .from('questions')
                .insert([transformedQuestion]);

            if (error) {
                console.error(`❌ Error uploading question ${index + 1}:`, error);
                errors.push(`Question ${index + 1} (${question.id}): ${error.message}`);
            } else {
                uploadedCount++;
                console.log(`✅ Successfully uploaded question ${index + 1}: ${question.id}`);
            }
        } catch (questionError) {
            console.error(`❌ Unexpected error with question ${index + 1}:`, questionError);
            errors.push(`Question ${index + 1} (${question.id}): Unexpected error`);
        }
    }

    console.log(`📊 Upload complete for ${fileDescription}. Success: ${uploadedCount}/${questionsToUpload.length}, Errors: ${errors.length}`);

    return {
        success: uploadedCount > 0,
        uploadedCount,
        errors,
        batchId,
        skipped: false
    };
}

async function findAndUploadAllQuestions() {
    console.log('🔍 Scanning for Hebrew restatement question files...');
    
    const results = [];
    let totalUploaded = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // Find all JSON files that contain restatement questions
    const searchDirs = [
        path.join(__dirname, 'questions-hebrew'),
        __dirname
    ];

    for (const searchDir of searchDirs) {
        try {
            const files = await findJSONFiles(searchDir);
            
            for (const filePath of files) {
                try {
                    const content = await fs.readFile(filePath, 'utf8');
                    const data = JSON.parse(content);
                    
                    // Check if this file contains restatement questions
                    if (data.metadata && data.metadata.type === 'restatement' && data.questions) {
                        console.log(`\n📄 Found restatement file: ${path.relative(__dirname, filePath)}`);
                        console.log(`   Difficulty: ${data.metadata.difficulty}, Count: ${data.metadata.count}`);
                        
                        const result = await uploadQuestionBatch(
                            data.questions, 
                            path.relative(__dirname, filePath)
                        );
                        
                        results.push({
                            file: path.relative(__dirname, filePath),
                            ...result
                        });
                        
                        if (result.skipped) {
                            totalSkipped += data.questions.length;
                        } else {
                            totalUploaded += result.uploadedCount;
                            totalErrors += result.errors.length;
                        }
                    }
                } catch (parseError) {
                    console.log(`⚠️ Could not parse ${filePath}: ${parseError.message}`);
                }
            }
        } catch (dirError) {
            console.log(`⚠️ Could not search directory ${searchDir}: ${dirError.message}`);
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 UPLOAD SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total questions uploaded: ${totalUploaded}`);
    console.log(`⚠️ Total questions skipped (duplicates): ${totalSkipped}`);
    console.log(`❌ Total errors: ${totalErrors}`);
    console.log(`📁 Files processed: ${results.length}`);
    
    console.log('\n📋 Detailed Results:');
    results.forEach(result => {
        const status = result.skipped ? '⚠️ SKIPPED' : result.success ? '✅ SUCCESS' : '❌ FAILED';
        console.log(`   ${status} ${result.file}: ${result.uploadedCount} uploaded`);
        if (result.errors.length > 0) {
            result.errors.slice(0, 3).forEach(error => console.log(`      ❌ ${error}`));
            if (result.errors.length > 3) {
                console.log(`      ... and ${result.errors.length - 3} more errors`);
            }
        }
    });
}

async function findJSONFiles(dir) {
    const files = [];
    
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                const subFiles = await findJSONFiles(fullPath);
                files.push(...subFiles);
            } else if (entry.isFile() && entry.name.endsWith('.json') && !entry.name.includes('last-ids')) {
                files.push(fullPath);
            }
        }
    } catch (error) {
        // Directory doesn't exist or can't be read
    }
    
    return files;
}

// Run the upload
findAndUploadAllQuestions().catch(console.error);