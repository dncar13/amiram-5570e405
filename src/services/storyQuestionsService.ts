
import { Question } from '@/data/types/questionTypes';
import { getAllQuestions } from '@/services/questionsService';

export interface Story {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

// Get all available stories from reading comprehension questions
export const getAvailableStories = (): Story[] => {
  const allQuestions = getAllQuestions();
  const readingQuestions = allQuestions.filter(q => 
    q.type === 'reading-comprehension' && q.passageText
  );

  // Group questions by passage title
  const storiesMap = new Map<string, Question[]>();
  
  readingQuestions.forEach(question => {
    const title = question.passageTitle || 'ללא כותרת';
    if (!storiesMap.has(title)) {
      storiesMap.set(title, []);
    }
    storiesMap.get(title)!.push(question);
  });

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

    return {
      id: title.replace(/\s+/g, '-').toLowerCase(),
      title,
      description: questions[0]?.passageText?.substring(0, 100) + '...' || '',
      questionCount: questions.length,
      difficulty
    };
  });

  return stories;
};

// Get questions for a specific story
export const getQuestionsByStory = (storyId: string): Question[] => {
  const allQuestions = getAllQuestions();
  const stories = getAvailableStories();
  const story = stories.find(s => s.id === storyId);
  
  if (!story) return [];

  return allQuestions.filter(q => 
    q.type === 'reading-comprehension' && 
    q.passageTitle === story.title
  );
};

// Get story by ID
export const getStoryById = (storyId: string): Story | undefined => {
  const stories = getAvailableStories();
  return stories.find(s => s.id === storyId);
};
