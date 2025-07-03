const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// הגדרות Supabase
const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Manually create reading comprehension questions since they have complex dependencies
const readingQuestions = [
  // Gig Economy Questions
  {
    id: 700,
    type: 'reading-comprehension',
    text: "The first paragraph suggests that the traditional employment model has _____ in recent decades",
    options: [
      "remained completely unchanged",
      "become more popular than ever",
      "undergone significant changes",
      "been completely eliminated"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The text states that the traditional model 'has undergone a dramatic transformation in recent decades.'",
    passageText: `The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.

The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.

For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work on multiple projects in the morning, own a ride-share service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential.

However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses. During economic downturns, gig workers are often the first to see their income disappear as they have no job security or guaranteed minimum wage.

The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of "working poor" - people who are employed but still live in poverty.

Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections. Others are exploring new forms of portable benefits that could move from job to job, rather than being tied to a single employer.

The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.`,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["employment-change", "transformation"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 701,
    type: 'reading-comprehension',
    text: "Which of the following platforms is mentioned in the text as an example of the gig economy?",
    options: [
      "Facebook",
      "Amazon",
      "TaskRabbit",
      "LinkedIn"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "TaskRabbit is specifically mentioned as one of the digital platforms that facilitate the gig economy.",
    passageText: `The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.

The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.

For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work on multiple projects in the morning, own a ride-share service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential.

However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses. During economic downturns, gig workers are often the first to see their income disappear as they have no job security or guaranteed minimum wage.

The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of "working poor" - people who are employed but still live in poverty.

Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections. Others are exploring new forms of portable benefits that could move from job to job, rather than being tied to a single employer.

The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.`,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["platforms", "digital-economy"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 702,
    type: 'reading-comprehension',
    text: "According to the passage, what is one advantage of the gig economy for workers?",
    options: [
      "Guaranteed health insurance",
      "Job security",
      "Flexibility in scheduling",
      "Paid vacation time"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The text mentions that the gig economy offers 'unprecedented flexibility and autonomy' and workers can 'choose their own schedules.'",
    passageText: `The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.

The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.

For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work on multiple projects in the morning, own a ride-share service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential.

However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses. During economic downturns, gig workers are often the first to see their income disappear as they have no job security or guaranteed minimum wage.

The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of "working poor" - people who are employed but still live in poverty.

Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections. Others are exploring new forms of portable benefits that could move from job to job, rather than being tied to a single employer.

The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.`,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["flexibility", "advantages"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 703,
    type: 'reading-comprehension',
    text: "What does the passage suggest about income inequality in the gig economy?",
    options: [
      "It has decreased significantly",
      "It remains unchanged",
      "It has widened",
      "It only affects part-time workers"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The text explicitly states that 'As more people become gig workers, income inequality has widened.'",
    passageText: `The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.

The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.

For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work on multiple projects in the morning, own a ride-share service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential.

However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses. During economic downturns, gig workers are often the first to see their income disappear as they have no job security or guaranteed minimum wage.

The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of "working poor" - people who are employed but still live in poverty.

Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections. Others are exploring new forms of portable benefits that could move from job to job, rather than being tied to a single employer.

The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.`,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["inequality", "social-implications"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 704,
    type: 'reading-comprehension',
    text: "According to the passage, what challenge do governments face regarding the gig economy?",
    options: [
      "Eliminating all gig work",
      "Regulating this new economic model",
      "Preventing digital platforms from operating",
      "Forcing workers back to traditional employment"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The text states that 'Governments worldwide are grappling with how to regulate this new economic model.'",
    passageText: `The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.

The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.

For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work on multiple projects in the morning, own a ride-share service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential.

However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses. During economic downturns, gig workers are often the first to see their income disappear as they have no job security or guaranteed minimum wage.

The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of "working poor" - people who are employed but still live in poverty.

Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections. Others are exploring new forms of portable benefits that could move from job to job, rather than being tied to a single employer.

The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.`,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["government", "regulation"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  }
];

// Import function
async function importQuestions(questionsArray) {
  console.log(`\n🔄 Starting import of ${questionsArray.length} reading questions...`);
  
  // Transform questions for Supabase
  const transformedQuestions = questionsArray.map(q => ({
    original_id: q.id.toString(),
    type: q.type,
    text: q.text,
    options: q.options,
    correct_answer: q.correctAnswer,
    explanation: q.explanation || null,
    difficulty: q.difficulty || 'medium',
    passage_text: q.passageText || null,
    passage_title: q.passageTitle || null,
    topic_id: q.topicId || null,
    tags: q.tags || null,
    metadata: q.metadata || null
  }));

  // Import in chunks
  const chunkSize = 10;
  let imported = 0;
  let failed = 0;
  
  for (let i = 0; i < transformedQuestions.length; i += chunkSize) {
    const chunk = transformedQuestions.slice(i, i + chunkSize);
    const chunkNumber = Math.floor(i / chunkSize) + 1;
    const totalChunks = Math.ceil(transformedQuestions.length / chunkSize);
    
    console.log(`📦 Processing chunk ${chunkNumber}/${totalChunks} (${chunk.length} questions)...`);
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(chunk);
      
      if (error) {
        console.error(`❌ Error in chunk ${chunkNumber}:`, error.message);
        failed += chunk.length;
      } else {
        imported += chunk.length;
        console.log(`✅ Chunk ${chunkNumber} imported successfully`);
      }
    } catch (chunkError) {
      console.error(`❌ Exception in chunk ${chunkNumber}:`, chunkError.message);
      failed += chunk.length;
    }
    
    console.log(`📈 Progress: ${imported} imported, ${failed} failed`);
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n🎉 Reading questions import completed!`);
  console.log(`✅ Successfully imported: ${imported} questions`);
  console.log(`❌ Failed to import: ${failed} questions`);
  console.log(`📊 Success rate: ${((imported / transformedQuestions.length) * 100).toFixed(1)}%`);
}

// Verification function
async function verifyImport() {
  console.log('\n🔍 Verifying total questions in database...');
  
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('type, difficulty')
      .order('type');
    
    if (error) {
      console.error('❌ Error verifying:', error.message);
      return;
    }
    
    console.log(`📊 Total questions in database: ${data.length}`);
    
    const breakdown = data.reduce((acc, q) => {
      const key = `${q.type} (${q.difficulty})`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📋 Complete database breakdown:');
    Object.entries(breakdown).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} questions`);
    });
    
  } catch (error) {
    console.error('❌ Error in verification:', error.message);
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Importing reading comprehension questions...');
    console.log(`📚 ${readingQuestions.length} reading questions ready to import`);
    
    await importQuestions(readingQuestions);
    
  } catch (error) {
    console.error('❌ Error in main function:', error);
  }
}

// Run the script
if (require.main === module) {
  main()
    .then(() => verifyImport())
    .catch(console.error);
}