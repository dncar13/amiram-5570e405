// Test script to verify our story fixes
console.log('🧪 Testing Story Fixes');
console.log('='.repeat(50));

// Mock the necessary dependencies
global.getAllQuestions = () => {
  return [
    {
      id: 2001,
      type: 'sentence-completion',
      text: "הפסקה הראשונה מציעה שהמודל המסורתי של תעסוקה _____ בעשרות השנים האחרונות",
      options: [
        "נשאר ללא שינוי לחלוטין",
        "הפך פופולרי יותר מאי פעם",
        "עבר שינויים משמעותיים",
        "הוחלף לחלוטין"
      ],
      correctAnswer: 2,
      difficulty: 'easy',
      explanation: "הטקסט מתאר שינוי דרמטי במודל התעסוקה המסורתי, מה שמצביע על שינויים משמעותיים.",
      passageText: "כלכלת הגיג: מהפכה בעולם העבודה\n\nהמודל המסורתי של תעסוקה...",
      passageTitle: "כלכלת הגיג: מהפכה בעולם העבודה",
      topicId: 3,
      tags: ["employment", "economic-change"],
      metadata: {
        topic: "כלכלת הגיג",
        wordCount: 4,
        estimatedTime: 2
      }
    },
    {
      id: 2002,
      type: 'reading-comprehension',
      text: "על פי הטקסט, איזה מהיתרונות הבאים מציעה כלכלת הגיג לעובדים?",
      options: [
        "ביטוח בריאות מובטח",
        "שכר קבוע ויציב",
        "גמישות בלוח הזמנים",
        "ביטחון תעסוקתי מלא"
      ],
      correctAnswer: 2,
      difficulty: 'medium',
      explanation: "הטקסט מזכיר במפורש את הגמישות ואת האוטונומיה כיתרונות של כלכלת הגיג.",
      passageText: "כלכלת הגיג: מהפכה בעולם העבודה\n\nהמודל המסורתי של תעסוקה...",
      passageTitle: "כלכלת הגיג: מהפכה בעולם העבודה",
      topicId: 3,
      tags: ["advantages", "flexibility"],
      metadata: {
        topic: "כלכלת הגיג",
        wordCount: 4,
        estimatedTime: 3
      }
    }
  ];
};

// Mock the subject classification
global.identifyQuestionSubject = (question) => {
  if (question.passageTitle && question.passageTitle.includes('כלכלת הגיג')) {
    return 'economics';
  }
  return 'technology';
};

// Test story creation logic
const getAvailableStories = () => {
  const allQuestions = global.getAllQuestions();
  const readingQuestions = allQuestions.filter(q => 
    q.passageText && q.passageTitle
  );

  console.log('📊 Questions found with passageText and passageTitle:', readingQuestions.length);
  
  // Group questions by passage title
  const storiesMap = new Map();
  
  readingQuestions.forEach(question => {
    const title = question.passageTitle || 'ללא כותרת';
    if (!storiesMap.has(title)) {
      storiesMap.set(title, []);
    }
    storiesMap.get(title).push(question);
  });

  console.log('📖 Stories found:', storiesMap.size);
  
  // Convert to Story objects
  const stories = Array.from(storiesMap.entries()).map(([title, questions]) => {
    const difficulties = questions.map(q => q.difficulty);
    
    let difficulty = 'medium';
    const hasEasy = difficulties.includes('easy');
    const hasMedium = difficulties.includes('medium');
    const hasHard = difficulties.includes('hard');
    
    if (hasEasy && hasMedium && hasHard) {
      difficulty = 'mixed';
    } else if (hasHard) {
      difficulty = 'hard';
    } else if (hasMedium) {
      difficulty = 'medium';
    } else if (hasEasy) {
      difficulty = 'easy';
    }

    const subjects = questions.map(q => global.identifyQuestionSubject(q)).filter(Boolean);
    const primarySubject = subjects.length > 0 ? subjects[0] : undefined;

    const story = {
      id: title.replace(/\s+/g, '-').toLowerCase(),
      title,
      description: questions[0]?.passageText?.substring(0, 100) + '...' || '',
      questionCount: questions.length,
      difficulty,
      subject: primarySubject
    };
    
    console.log('✅ Created story:', {
      id: story.id,
      title: story.title,
      questionCount: story.questionCount,
      difficulty: story.difficulty,
      subject: story.subject
    });
    
    return story;
  });

  return stories;
};

// Test story question retrieval
const getQuestionsByStory = (storyId) => {
  const allQuestions = global.getAllQuestions();
  const stories = getAvailableStories();
  const story = stories.find(s => s.id === storyId);
  
  if (!story) {
    console.log('❌ Story not found for ID:', storyId);
    return [];
  }

  console.log('🔍 Looking for questions for story:', story.title);
  
  const storyQuestions = allQuestions.filter(q => 
    q.passageTitle === story.title && q.passageText
  );
  
  console.log('📋 Questions found for story:', storyQuestions.length);
  storyQuestions.forEach((q, index) => {
    console.log(`   ${index + 1}. Type: ${q.type}, Difficulty: ${q.difficulty}`);
  });
  
  return storyQuestions;
};

// Run tests
console.log('\n🧪 Running story creation test...');
const stories = getAvailableStories();

console.log('\n🧪 Running story question retrieval test...');
if (stories.length > 0) {
  const testStoryId = stories[0].id;
  console.log('🎯 Testing with story ID:', testStoryId);
  const questions = getQuestionsByStory(testStoryId);
  
  if (questions.length > 0) {
    console.log('✅ SUCCESS: Found questions for story!');
  } else {
    console.log('❌ FAILED: No questions found for story');
  }
} else {
  console.log('❌ FAILED: No stories created');
}

console.log('\n' + '='.repeat(50));
console.log('🎉 Test completed!');
