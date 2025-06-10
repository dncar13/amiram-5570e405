
import { Question } from '@/data/types/questionTypes';
import { getAllQuestions, getReadingComprehensionQuestions } from '@/services/questionsService';
import { GeneralSubject, identifyQuestionSubject } from '@/services/subjectClassificationService';

export interface Story {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  subject?: GeneralSubject;
}

// Get all available stories from reading comprehension questions
export const getAvailableStories = (): Story[] => {
  console.log('[DEBUG] getAvailableStories called');
  
  // Use getReadingComprehensionQuestions instead of getAllQuestions to ensure we get all RC questions
  const allReadingQuestions = getReadingComprehensionQuestions();
  console.log('[DEBUG] Total reading questions loaded:', allReadingQuestions.length);
  
  // פילטור שאלות שיש להן גם passageText וגם passageTitle
  const readingQuestions = allReadingQuestions.filter(q => {
    const hasPassageText = !!q.passageText;
    const hasPassageTitle = !!q.passageTitle;
    const isReadingType = q.type === 'reading-comprehension';
    
    console.log(`[DEBUG] Question ${q.id}: hasPassageText=${hasPassageText}, hasPassageTitle=${hasPassageTitle}, isReadingType=${isReadingType}`);
    
    return hasPassageText && hasPassageTitle && isReadingType;
  });
  
  console.log('[DEBUG] Reading questions found:', readingQuestions.length);
  readingQuestions.forEach(q => {
    console.log(`[DEBUG] Reading question: ${q.id} - "${q.passageTitle}"`);
  });

  // Group questions by passage title
  const storiesMap = new Map<string, Question[]>();
  
  readingQuestions.forEach(question => {
    const title = question.passageTitle || 'ללא כותרת';
    if (!storiesMap.has(title)) {
      storiesMap.set(title, []);
    }
    storiesMap.get(title)!.push(question);
  });

  console.log('[DEBUG] Stories map:', Array.from(storiesMap.keys()));

  // Convert to Story objects
  const stories: Story[] = Array.from(storiesMap.entries()).map(([title, questions]) => {
    const difficulties = questions.map(q => q.difficulty);
    const hasEasy = difficulties.includes('easy');
    const hasMedium = difficulties.includes('medium');
    const hasHard = difficulties.includes('hard');
    
    let difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'medium';
    if (hasEasy && hasMedium && hasHard) {
      difficulty = 'mixed';
    } else if (hasHard) {
      difficulty = 'hard';
    } else if (hasMedium) {
      difficulty = 'medium';
    } else if (hasEasy) {
      difficulty = 'easy';
    }
    
    // Determine the primary subject of the story
    const subjects = questions.map(q => identifyQuestionSubject(q)).filter(Boolean);
    const subjectCounts: Record<string, number> = {};
    subjects.forEach(subject => {
      if (subject) {
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      }
    });
    const primarySubject = Object.keys(subjectCounts).length > 0 
      ? Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0][0] as GeneralSubject
      : undefined;

    const story = {
      id: title.replace(/\s+/g, '-').toLowerCase(),
      title,
      description: questions[0]?.passageText?.substring(0, 100) + '...' || '',
      questionCount: questions.length,
      difficulty,
      subject: primarySubject
    };
    
    console.log('[DEBUG] Created story:', story);
    return story;
  });

  console.log('[DEBUG] Final stories:', stories.length);
  console.log('[DEBUG] Stories found:', stories.map(s => ({ title: s.title, count: s.questionCount, subject: s.subject })));
  return stories;
};

// Get questions for a specific story
export const getQuestionsByStory = (storyId: string): Question[] => {
  const allQuestions = getAllQuestions();
  
  // Decode the URL-encoded story ID back to the original title
  const decodedTitle = decodeURIComponent(storyId);
  
  console.log('Searching for story with title:', decodedTitle);
  
  const questions = allQuestions.filter(q => {
    const hasMatchingTitle = q.passageTitle === decodedTitle;
    const hasPassageText = !!q.passageText;
    
    if (hasMatchingTitle) {
      console.log('Found matching question for story:', q.passageTitle);
    }
    
    return hasMatchingTitle && hasPassageText;
  });
  
  console.log(`Found ${questions.length} questions for story: "${decodedTitle}"`);
  return questions;
};

// Get story by ID
export const getStoryById = (storyId: string): Story | undefined => {
  // Decode the URL-encoded story ID back to the original title
  const decodedTitle = decodeURIComponent(storyId);
  
  const stories = getAvailableStories();
  return stories.find(s => s.title === decodedTitle);
};

// Filter stories by difficulty and subject
export const getFilteredStories = (
  difficultyFilter: 'all' | 'easy' | 'medium' | 'hard' = 'all',
  subjectFilter: 'all' | GeneralSubject = 'all'
): Story[] => {
  let stories = getAvailableStories();
  
  // Filter by difficulty
  if (difficultyFilter !== 'all') {
    stories = stories.filter(story => {
      if (difficultyFilter === story.difficulty) return true;
      // For mixed difficulty, include if it contains the requested difficulty
      if (story.difficulty === 'mixed') {
        const questions = getQuestionsByStory(story.id);
        return questions.some(q => q.difficulty === difficultyFilter);
      }
      return false;
    });
  }
  
  // Filter by subject
  if (subjectFilter !== 'all') {
    stories = stories.filter(story => story.subject === subjectFilter);
  }
  
  return stories;
};

// Get available subjects from all stories
export const getAvailableSubjects = (): GeneralSubject[] => {
  const stories = getAvailableStories();
  const subjects = stories.map(s => s.subject).filter(Boolean) as GeneralSubject[];
  return Array.from(new Set(subjects));
};
