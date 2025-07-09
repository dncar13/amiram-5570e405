-- הוספת עוד שאלות reading comprehension
INSERT INTO questions (
  text, type, options, correct_answer, difficulty, explanation, 
  passage_text, passage_title, topic_id, tags, original_id
) VALUES 
-- Environment שאלה 1
(
  'What was the main outcome of Costa Rica''s Payment for Ecosystem Services program?',
  'reading-comprehension',
  '["It increased the country''s GDP by 50%", "It reversed deforestation, increasing forest cover from 26% to over 52%", "It eliminated the need for traditional farming practices", "It established Costa Rica as the leading producer of sustainable timber"]',
  1,
  'medium',
  E'The passage states that "This market-based approach has helped Costa Rica become the only tropical country to reverse deforestation, with forest cover increasing from 26% in the 1980s to over 52% today." This clearly indicates that the primary outcome was reversing deforestation and significantly increasing forest cover.',
  E'The concept of "ecosystem services" has revolutionized how we understand the relationship between human prosperity and environmental health. Ecosystem services refer to the countless benefits that healthy, functioning ecosystems provide to humans—clean water, fertile soil, climate regulation, and even cultural inspiration. While these services have traditionally been taken for granted, their economic value is increasingly recognized as essential to sustainable development.\n\nOne remarkable example of this paradigm shift is Costa Rica''s pioneering Payment for Ecosystem Services (PES) program, established in 1997. Before this initiative, Costa Rica had one of the highest deforestation rates globally, losing approximately 50% of its forest cover. The PES program fundamentally altered this trajectory by compensating landowners for preserving forests rather than converting them to farmland.',
  'Environment Reading',
  7,
  '["medium-level", "detail", "environment"]',
  26
),

-- Technology שאלה 2
(
  'What has been one of the most significant developments in recent technology according to the passage?',
  'reading-comprehension',
  '["The invention of the internet", "The rise of artificial intelligence and machine learning", "The development of smartphones", "The creation of social media platforms"]',
  1,
  'medium',
  E'The passage explicitly states "One of the most significant developments has been the rise of artificial intelligence and machine learning."',
  E'The past two decades have witnessed an unprecedented technological transformation that has fundamentally altered nearly every aspect of human life. From the way we communicate and work to how we learn and entertain ourselves, digital technology has become the invisible thread weaving through the fabric of modern society. This digital revolution, characterized by the convergence of computing power, internet connectivity, and mobile devices, has created new possibilities while simultaneously presenting complex challenges.\n\nOne of the most significant developments has been the rise of artificial intelligence and machine learning. These technologies are no longer confined to research laboratories but have become integral to everyday applications.',
  'Technology Reading',
  2,
  '["medium-level", "detail", "technology"]',
  1002
),

-- Gig Economy שאלה 3
(
  'According to the passage, what is one of the main disadvantages of gig work?',
  'reading-comprehension',
  '["Limited flexibility in scheduling", "Too much government regulation", "Lack of benefits and job security", "Excessive training requirements"]',
  2,
  'medium',
  E'The passage states that "Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security."',
  E'The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.\n\nHowever, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses.',
  'The Rise of the Gig Economy',
  3,
  '["disadvantages", "benefits"]',
  3
);