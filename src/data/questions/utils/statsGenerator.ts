
export function generateQuestionStats(questions: any[]) {
  const stats = {
    total: questions.length,
    byDifficulty: {} as Record<string, number>,
    bySubject: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    averageEstimatedTime: 0,
    totalEstimatedTime: 0
  };
  
  let totalTime = 0;
  let questionsWithTime = 0;
  
  questions.forEach(question => {
    // Count by difficulty
    if (question.difficulty) {
      stats.byDifficulty[question.difficulty] = (stats.byDifficulty[question.difficulty] || 0) + 1;
    }
    
    // Count by type
    if (question.type) {
      stats.byType[question.type] = (stats.byType[question.type] || 0) + 1;
    }
    
    // Calculate time statistics
    if (question.estimatedTime) {
      totalTime += question.estimatedTime;
      questionsWithTime++;
    }
  });
  
  // Calculate average time
  if (questionsWithTime > 0) {
    stats.averageEstimatedTime = Math.round(totalTime / questionsWithTime);
    stats.totalEstimatedTime = totalTime;
  }
  
  return stats;
}

export function generateStoryStats(stories: any[]) {
  const stats = {
    totalStories: stories.length,
    totalQuestions: 0,
    byDifficulty: {} as Record<string, number>,
    bySubject: {} as Record<string, number>,
    averageQuestionsPerStory: 0,
    averageWordCount: 0
  };
  
  let totalQuestions = 0;
  let totalWordCount = 0;
  
  stories.forEach(story => {
    const questionCount = story.questions.length;
    totalQuestions += questionCount;
    
    // Count by difficulty
    if (story.metadata.difficulty) {
      stats.byDifficulty[story.metadata.difficulty] = (stats.byDifficulty[story.metadata.difficulty] || 0) + 1;
    }
    
    // Count by subject
    if (story.metadata.subject) {
      stats.bySubject[story.metadata.subject] = (stats.bySubject[story.metadata.subject] || 0) + 1;
    }
    
    // Word count
    if (story.passage.wordCount) {
      totalWordCount += story.passage.wordCount;
    }
  });
  
  stats.totalQuestions = totalQuestions;
  stats.averageQuestionsPerStory = stories.length > 0 ? Math.round(totalQuestions / stories.length) : 0;
  stats.averageWordCount = stories.length > 0 ? Math.round(totalWordCount / stories.length) : 0;
  
  return stats;
}
