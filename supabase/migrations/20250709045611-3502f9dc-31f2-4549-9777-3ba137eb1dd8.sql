-- המשך שאלות Gig Economy + תחילת שאלות Technology
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
  'The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.

The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.

For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work on multiple projects in the morning, own a ride-share service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential.

However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses. During economic downturns, gig workers are often the first to see their income disappear as they have no job security or guaranteed minimum wage.

The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of "working poor" - people who are employed but still live in poverty.

Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections. Others are exploring new forms of portable benefits that could move from job to job, rather than being tied to a single employer.

The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.',
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
  'The passage explicitly states that "This digital revolution, characterized by the convergence of computing power, internet connectivity, and mobile devices, has created new possibilities while simultaneously presenting complex challenges."',
  'The past two decades have witnessed an unprecedented technological transformation that has fundamentally altered nearly every aspect of human life. From the way we communicate and work to how we learn and entertain ourselves, digital technology has become the invisible thread weaving through the fabric of modern society. This digital revolution, characterized by the convergence of computing power, internet connectivity, and mobile devices, has created new possibilities while simultaneously presenting complex challenges.

One of the most significant developments has been the rise of artificial intelligence and machine learning. These technologies are no longer confined to research laboratories but have become integral to everyday applications. AI algorithms now power search engines, recommend products on shopping platforms, detect fraud in financial transactions, and even assist doctors in diagnosing diseases. Machine learning systems continuously improve their performance by analyzing vast amounts of data, leading to increasingly sophisticated applications that can recognize speech, translate languages in real-time, and even generate creative content.

The widespread adoption of cloud computing has democratized access to powerful computing resources. Small businesses can now access the same computational capabilities that were once exclusive to large corporations, leveling the playing field in many industries. This shift has enabled the rise of countless startups and innovative companies that operate entirely in digital spaces. Remote work, accelerated by global events, has become not just possible but preferable for many organizations, fundamentally changing traditional concepts of workplace and career.

However, this technological advancement comes with significant challenges. Privacy concerns have escalated as companies collect unprecedented amounts of personal data. Cybersecurity threats have evolved alongside technological capabilities, requiring constant vigilance and adaptation. The digital divide has become more pronounced, with unequal access to technology creating new forms of social and economic inequality. Additionally, the automation of jobs raises important questions about the future of work and the need for educational systems to adapt to rapidly changing skill requirements.

Despite these challenges, the trajectory of technological development shows no signs of slowing. Emerging technologies like quantum computing, biotechnology, and renewable energy systems promise to address some of humanity's most pressing challenges while creating new opportunities for innovation and growth.',
  'Technology Reading',
  2,
  '["medium-level", "detail", "technology"]',
  1001
);