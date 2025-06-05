// Test story loading
import { getAvailableStories } from './src/services/storyQuestionsService.ts';

console.log('Testing story loading...');

try {
  const stories = getAvailableStories();
  console.log('Total stories found:', stories.length);
  
  stories.forEach((story, index) => {
    console.log(`Story ${index + 1}:`);
    console.log('- ID:', story.id);
    console.log('- Title:', story.title);
    console.log('- Question Count:', story.questionCount);
    console.log('- Difficulty:', story.difficulty);
    console.log('- Subject:', story.subject);
    console.log('---');
  });
  
  // Look specifically for gig economy story
  const gigStory = stories.find(s => s.title.includes('כלכלת הגיג') || s.title.includes('gig'));
  if (gigStory) {
    console.log('Found gig economy story:', gigStory);
  } else {
    console.log('Gig economy story NOT found');
  }
  
} catch (error) {
  console.error('Error loading stories:', error);
}
