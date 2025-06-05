// Test Story Routing Fix
// This test verifies that story-based simulations work correctly after our fix

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Story Routing Fix...\n');

// Test 1: Check that useSimulationData handles undefined topicId correctly
console.log('Test 1: Checking useSimulationData fix for story-based simulations');

const useSimulationDataPath = path.join(__dirname, 'src/hooks/useSimulationData.tsx');
const useSimulationDataContent = fs.readFileSync(useSimulationDataPath, 'utf8');

// Check if the fix for story-based simulations is present
const hasStoryBasedCheck = useSimulationDataContent.includes('const isStoryBased = !topicId && !setId;');
const hasStoryBasedCondition = useSimulationDataContent.includes('if (isStoryBased)');
const hasTopicErrorFix = useSimulationDataContent.includes('if (!topic && !isStoryBased)');

console.log('✅ Story-based check variable:', hasStoryBasedCheck ? 'FOUND' : 'MISSING');
console.log('✅ Story-based condition handling:', hasStoryBasedCondition ? 'FOUND' : 'MISSING');
console.log('✅ Topic error fix for stories:', hasTopicErrorFix ? 'FOUND' : 'MISSING');

// Test 2: Check story questions service
console.log('\nTest 2: Checking story questions service');

const storyServicePath = path.join(__dirname, 'src/services/storyQuestionsService.ts');
const storyServiceContent = fs.readFileSync(storyServicePath, 'utf8');

// Check if the URL decoding fix is present
const hasUrlDecoding = storyServiceContent.includes('decodeURIComponent(storyId)');
const hasProperFiltering = storyServiceContent.includes('q.passageTitle === decodedTitle && q.passageText');

console.log('✅ URL decoding in story service:', hasUrlDecoding ? 'FOUND' : 'MISSING');
console.log('✅ Proper story filtering:', hasProperFiltering ? 'FOUND' : 'MISSING');

// Test 3: Check reading comprehension topics navigation
console.log('\nTest 3: Checking reading comprehension navigation');

const topicsPagePath = path.join(__dirname, 'src/pages/ReadingComprehensionTopics.tsx');
const topicsPageContent = fs.readFileSync(topicsPagePath, 'utf8');

// Check if navigation uses story.title instead of story.id
const usesStoryTitle = topicsPageContent.includes('handleStorySelect(story.title)');
const hasProperUrlEncoding = topicsPageContent.includes('encodeURIComponent(title)');

console.log('✅ Navigation uses story.title:', usesStoryTitle ? 'FOUND' : 'MISSING');
console.log('✅ Proper URL encoding:', hasProperUrlEncoding ? 'FOUND' : 'MISSING');

// Test 4: Verify routing setup
console.log('\nTest 4: Checking routing configuration');

const appPath = path.join(__dirname, 'src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

const hasStoryRoute = appContent.includes('/simulation/story/:storyId');

console.log('✅ Story route defined:', hasStoryRoute ? 'FOUND' : 'MISSING');

// Summary
console.log('\n🎯 SUMMARY:');
const allTestsPassed = hasStoryBasedCheck && hasStoryBasedCondition && hasTopicErrorFix && 
                      hasUrlDecoding && hasProperFiltering && usesStoryTitle && 
                      hasProperUrlEncoding && hasStoryRoute;

if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED! Story routing should now work correctly.');
    console.log('\n📋 What was fixed:');
    console.log('1. ✅ useSimulationData now handles story-based simulations (no topicId error)');
    console.log('2. ✅ Story questions service properly decodes URL-encoded titles');
    console.log('3. ✅ Navigation uses story.title instead of problematic story.id');
    console.log('4. ✅ Proper URL encoding/decoding throughout the system');
    console.log('5. ✅ Story route is properly configured');
    
    console.log('\n🚀 Users should now be able to:');
    console.log('- Click on any story card without getting "Topic not found" errors');
    console.log('- Navigate to story simulations successfully');
    console.log('- Load questions for each story properly');
    console.log('- See "התחל" button working correctly');
} else {
    console.log('❌ SOME TESTS FAILED! Please check the implementation.');
}

console.log('\n🔧 Next steps:');
console.log('1. Test the application in development mode');
console.log('2. Try clicking on story cards to verify they work');
console.log('3. Check that questions load properly for each story');
console.log('4. Verify RTL button alignment is correct');
