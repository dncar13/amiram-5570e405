
import { ReadingPassage, ReadingQuestion, QuestionMetadata } from "../../../../types/questionTypes";

export const metadata: QuestionMetadata = {
  id: "rc-easy-eco-001",
  subject: "economics",
  difficulty: "easy",
  estimatedTime: 8,
  tags: ["employment", "technology", "modern-work", "flexibility"],
  author: "system",
  dateCreated: "2025-06-10",
  lastModified: "2025-06-10",
  validationStatus: "approved"
};

export const passage: ReadingPassage = {
  id: 101,
  title: "עליית כלכלת הפיגועים",
  topic: "תעסוקה",
  generalSubject: "economics",
  text: `המודל המסורתי של תעסוקה, בו עובדים החזיקו בעבודות קבועות ומלאות עם מעסיק אחד במשך עשורים, עבר טרנספורמציה דרמטית במאה ה-21. הופעתה של 'כלכלת הפיגועים' שינתה באופן יסודי את האופן שבו מיליוני אנשים עובדים ומרוויחים את פרנסתם.

כלכלת הפיגועים, המאופיינת בחוזים קצרי מועד ועבודה עצמאית במקום עבודות קבועות, הונעה על ידי התקדמות טכנולוגית ושינוי בהעדפות העובדים. פלטפורמות דיגיטליות כמו Uber, Airbnb ו-TaskRabbit הקלו יותר מתמיד על אנשים להפוך את כישוריהם, זמנהם ונכסיהם לרווח בצורה גמישה.

השינוי הזה מייצג הזדמנויות ואתגרים כאחד. מהצד החיובי, עבודת פיגועים מציעה גמישות חסרת תקדים, המאפשרת לאנשים לבחור מתי, איפה וכמה הם עובדים. היא יכולה לספק הכנסה נוספת, לאפשר מעברי קריירה ולהציע אוטונומיה שעבודה מסורתית לעיתים קרובות חסרה.

עם זאת, עובדי פיגועים מתמודדים בדרך כלל עם אי-ודאויות משמעותיות. הם חסרים את הביטחון התעסוקתי, ההטבות וההגנות החוקיות הכרוכות בתעסוקה מסורתית. ההכנסה יכולה להיות בלתי צפויה, והעובדים צריכים לעיתים קרובות לספק ציוד משלהם ולשאת בהוצאות עסקיות.`,
  wordCount: 285,
  readingLevel: "grade-10"
};

export const questions: ReadingQuestion[] = [
  {
    id: 10101,
    passageId: 101,
    type: "reading-comprehension",
    questionSubtype: "main-idea",
    text: "מה גרם לעליית כלכלת הפיגועים לפי הקטע?",
    options: [
      "רגולציה ממשלתית ותמיכה",
      "התקדמות טכנולוגית ושינוי בהעדפות העובדים",
      "דרישה ציבורית ולחץ שוק",
      "שיתוף פעולה בינלאומי ושיתוף"
    ],
    correctAnswer: 1,
    explanation: "הקטע קובע במפורש ש'כלכלת הפיגועים הונעה על ידי התקדמות טכנולוגית ושינוי בהעדפות העובדים.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["main-idea", "comprehension"],
    tips: "חפש את הביטוי שמסביר ישירות מה הניע את הצמיחה של כלכלת הפיגועים."
  },
  {
    id: 10102,
    passageId: 101,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "אילו פלטפורמות דיגיטליות מוזכרות בקטע?",
    options: [
      "Facebook, Google ו-Amazon",
      "Uber, Airbnb ו-TaskRabbit", 
      "LinkedIn, Indeed ו-Monster",
      "Netflix, Spotify ו-YouTube"
    ],
    correctAnswer: 1,
    explanation: "הקטע מזכיר במפורש את הפלטפורמות: 'Uber, Airbnb ו-TaskRabbit'.",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["details", "factual"],
    tips: "זהו מידע מפורש הנמצא ישירות בטקסט."
  },
  {
    id: 10103,
    passageId: 101,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "מה מנקודת מבטו הכללית של המחבר על כלכלת הפיגועים?",
    options: [
      "חיובית לחלוטין ללא חסרונות",
      "שלילית לחלוטין ובעייתית",
      "מאוזנת, מציגה יתרונות ואתגרים",
      "לא ברורה ולא מוגדרת"
    ],
    correctAnswer: 2,
    explanation: "הקטע מציג גם היבטים חיוביים (גמישות, אוטונומיה) וגם אתגרים (חוסר ביטחון תעסוקתי, הכנסה לא צפויה), מה שמעיד על נקודת מבט מאוזנת.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["inference", "author-intent"],
    tips: "חפש מילות איתות כמו 'עם זאת' ו'מהצד החיובי' שמעידות על כך שהמחבר מציג מספר נקודות מבט."
  },
  {
    id: 10104,
    passageId: 101,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "אילו אתגרים עומדים בפני עובדי פיגועים לפי הקטע?",
    options: [
      "יותר מדי פיקוח ומיקרו-ניהול",
      "חוסר ביטחון תעסוקתי, הטבות והגנות חוקיות",
      "שעות עבודה מוגזמות ושעות נוספות",
      "גישה מוגבלת לטכנולוגיה"
    ],
    correctAnswer: 1,
    explanation: "הקטע קובע ש'הם חסרים את הביטחון התעסוקתי, ההטבות וההגנות החוקיות הכרוכות בתעסוקה מסורתית.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["details", "challenges"],
    tips: "חפש את הקטע שדן בהיבטים השליליים או באתגרים של עבודת פיגועים."
  },
  {
    id: 10105,
    passageId: 101,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "במקרה זה, מה המשמעות של 'טרנספורמציה דרמטית'?",
    options: [
      "שינוי הדרגתי וקטן",
      "שינוי משמעותי ויסודי",
      "שינוי זמני ומועט",
      "שינוי עדין ובלתי מורגש"
    ],
    correctAnswer: 1,
    explanation: "'טרנספורמציה דרמטית' מתייחסת לשינוי גדול ובולט במודל התעסוקה המסורתי, כפי שמתואר בהמשך הקטע.",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["vocabulary", "context"],
    tips: "השתמש בהקשר של הקטע כדי להבין את עוצמת השינוי המתואר."
  }
];

export const gigEconomyStory = {
  metadata,
  passage,
  questions
};
