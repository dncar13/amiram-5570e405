
export const FULL_EXAM_SETTINGS = {
  total: 80,
  timeInMinutes: 60,
  timeInSeconds: 60 * 60, // 3600 seconds
  questionDistribution: {
    sentenceCompletion: 27,
    restatement: 26,
    readingComprehension: 27
  },
  examMode: true,
  showAnswersImmediately: false,
  allowNavigation: false,
  adaptiveMode: false // for future implementation
};

export const FULL_EXAM_RULES = {
  noGoingBack: true,
  noExplanationsDuringExam: true,
  autoAdvance: false, // user can answer faster than auto-advance
  singleAttemptPerQuestion: true,
  resultsSaved: true
};
