-- הוספת שאלות הבנת הנקרא לדאטאבייס
-- תחילה שאלות Gig Economy
INSERT INTO questions (
  text, type, options, correct_answer, difficulty, explanation, 
  passage_text, passage_title, topic_id, tags, original_id
) VALUES 
(
  'The first paragraph suggests that the traditional employment model has _____ in recent decades',
  'reading-comprehension',
  '["remained completely unchanged", "become more popular than ever", "undergone significant changes", "been completely eliminated"]',
  2,
  'medium',
  'The text states that the traditional model "has undergone a dramatic transformation in recent decades."',
  'The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.

The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.

For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work on multiple projects in the morning, own a ride-share service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential.

However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses. During economic downturns, gig workers are often the first to see their income disappear as they have no job security or guaranteed minimum wage.

The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of "working poor" - people who are employed but still live in poverty.

Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections. Others are exploring new forms of portable benefits that could move from job to job, rather than being tied to a single employer.

The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.',
  'The Rise of the Gig Economy',
  3,
  '["employment-change", "transformation"]',
  1
);