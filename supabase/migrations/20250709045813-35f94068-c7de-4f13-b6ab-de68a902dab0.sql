-- המשך שאלות Gig Economy + תחילת שאלות Technology (תיקון מירכאות)
INSERT INTO questions (
  text, type, options, correct_answer, difficulty, explanation, 
  passage_text, passage_title, topic_id, tags, original_id
) VALUES 
-- Gig Economy שאלה 2
(
  'Which of the following platforms is mentioned in the text as an example of the gig economy?',
  'reading-comprehension',
  '["Facebook", "Amazon", "TaskRabbit", "Google"]',
  2,
  'medium',
  'The passage mentions TaskRabbit as one of the digital platforms facilitating the gig economy.',
  E'The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.\n\nThe gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.',
  'The Rise of the Gig Economy',
  3,
  '["platforms", "gig-economy"]',
  2
),

-- Technology שאלה ראשונה
(
  'According to the passage, what characterizes the digital revolution?',
  'reading-comprehension',
  '["The replacement of all traditional industries with digital ones", "The convergence of computing power, internet connectivity, and mobile devices", "The elimination of human workers in favor of artificial intelligence", "The creation of entirely virtual economies separate from physical markets"]',
  1,
  'medium',
  E'The passage explicitly states that "This digital revolution, characterized by the convergence of computing power, internet connectivity, and mobile devices, has created new possibilities while simultaneously presenting complex challenges."',
  E'The past two decades have witnessed an unprecedented technological transformation that has fundamentally altered nearly every aspect of human life. From the way we communicate and work to how we learn and entertain ourselves, digital technology has become the invisible thread weaving through the fabric of modern society. This digital revolution, characterized by the convergence of computing power, internet connectivity, and mobile devices, has created new possibilities while simultaneously presenting complex challenges.',
  'Technology Reading',
  2,
  '["medium-level", "detail", "technology"]',
  1001
);