import { getAvailableStories, getFilteredStories } from '../src/services/storyQuestionsService.js';

async function testStoryService() {
  console.log('🧪 Testing storyQuestionsService (what the UI uses)...\n');
  
  try {
    // Test 1: Get all available stories
    console.log('1️⃣ Testing getAvailableStories():');
    const allStories = await getAvailableStories();
    console.log(`✅ Found ${allStories.length} total stories\n`);
    
    console.log('📋 Stories list:');
    allStories.forEach((story, i) => {
      console.log(`   ${i + 1}. "${story.title}" (${story.difficulty}) - ${story.questionCount} questions`);
      if (story.subject) console.log(`      Subject: ${story.subject}`);
    });
    
    // Test 2: Test filtering by difficulty
    console.log('\n2️⃣ Testing filtering by difficulty:');
    const easyStories = await getFilteredStories('easy', 'all');
    const mediumStories = await getFilteredStories('medium', 'all');
    const hardStories = await getFilteredStories('hard', 'all');
    
    console.log(`   Easy stories: ${easyStories.length}`);
    console.log(`   Medium stories: ${mediumStories.length}`);
    console.log(`   Hard stories: ${hardStories.length}`);
    
    // Test 3: Test filtering by subject
    console.log('\n3️⃣ Testing subject filtering:');
    const techStories = await getFilteredStories('all', 'technology');
    console.log(`   Technology stories: ${techStories.length}`);
    
    console.log(`\n🎯 SUMMARY:`);
    console.log(`   Total stories available: ${allStories.length}`);
    console.log(`   This is what ReadingComprehensionTopics.tsx should see!`);
    
    if (allStories.length >= 12) {
      console.log(`   ✅ SUCCESS: All AI-generated stories are visible!`);
    } else {
      console.log(`   ⚠️  Only ${allStories.length} stories visible (expected 12+)`);
    }
    
  } catch (error) {
    console.error('❌ Story service test failed:', error);
  }
}

testStoryService().catch(console.error);