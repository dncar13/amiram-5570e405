-- הוספת עוד שאלות reading comprehension
INSERT INTO questions (
  text, type, options, correct_answer, difficulty, explanation, 
  passage_text, passage_title, topic_id, tags, original_id
) VALUES 
-- Environment שאלה 2
(
  'What alternative did New York City choose instead of building expensive water filtration plants?',
  'reading-comprehension',
  '["Importing water from neighboring states", "Implementing strict water rationing programs", "Restoring the Catskill watershed that naturally purifies water", "Building underground reservoirs"]',
  2,
  'medium',
  E'The passage mentions that "officials faced a choice: build expensive water filtration plants costing $8-10 billion or restore the Catskill watershed that naturally purifies the city''s water supply" and they chose to invest in watershed protection.',
  E'The concept of "ecosystem services" has revolutionized how we understand the relationship between human prosperity and environmental health. In New York City, officials faced a choice: build expensive water filtration plants costing $8-10 billion or restore the Catskill watershed that naturally purifies the city''s water supply. By investing $1.5 billion in watershed protection—purchasing land buffers, compensating farmers for sustainable practices, and upgrading sewage treatment—the city saved billions while preserving vital natural systems.',
  'Environment Reading',
  7,
  '["medium-level", "detail", "environment"]',
  27
),

-- Technology שאלה 3
(
  'According to the passage, which challenge is NOT mentioned as resulting from technological advancement?',
  'reading-comprehension',
  '["Privacy concerns due to data collection", "Cybersecurity threats", "Increased global warming", "The digital divide creating inequality"]',
  2,
  'medium',
  E'The passage mentions privacy concerns, cybersecurity threats, and the digital divide, but does not mention global warming as a challenge resulting from technological advancement.',
  E'However, this technological advancement comes with significant challenges. Privacy concerns have escalated as companies collect unprecedented amounts of personal data. Cybersecurity threats have evolved alongside technological capabilities, requiring constant vigilance and adaptation. The digital divide has become more pronounced, with unequal access to technology creating new forms of social and economic inequality.',
  'Technology Reading',
  2,
  '["medium-level", "detail", "technology"]',
  1003
),

-- Gig Economy שאלה 4
(
  'What does the passage suggest about the future of work?',
  'reading-comprehension',
  '["The gig economy will completely replace traditional employment", "Technology will eliminate all human jobs", "A balance must be found between flexibility and security", "Government regulation will end the gig economy"]',
  2,
  'medium',
  E'The passage concludes that "The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive."',
  E'The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.',
  'The Rise of the Gig Economy',
  3,
  '["future-work", "balance"]',
  4
),

-- Technology שאלה 4
(
  'What has cloud computing enabled according to the passage?',
  'reading-comprehension',
  '["The elimination of all traditional businesses", "Democratized access to powerful computing resources", "Complete automation of all industries", "The end of remote work"]',
  1,
  'medium',
  E'The passage states that "The widespread adoption of cloud computing has democratized access to powerful computing resources. Small businesses can now access the same computational capabilities that were once exclusive to large corporations."',
  E'The widespread adoption of cloud computing has democratized access to powerful computing resources. Small businesses can now access the same computational capabilities that were once exclusive to large corporations, leveling the playing field in many industries. This shift has enabled the rise of countless startups and innovative companies that operate entirely in digital spaces.',
  'Technology Reading',
  2,
  '["medium-level", "detail", "technology"]',
  1004
);