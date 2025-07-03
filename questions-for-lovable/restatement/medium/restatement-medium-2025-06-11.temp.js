const questions = [
  {
    "type": "restatement",
    "text": "Original: 'Despite the rain, we enjoyed the picnic.'",
    "options": [
      "The picnic was perfect with sunny weather.",
      "We postponed the picnic due to rain.",
      "The rain ruined our picnic completely.",
      "We had fun at the picnic even though it rained."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the contrast between the negative circumstance (rain) and the positive outcome (enjoyment), preserving the original meaning.",
    "difficulty": "medium",
    "id": 3644
  },
  {
    "type": "restatement",
    "text": "Original: 'The professor implied that the exam would be difficult.'",
    "options": [
      "The professor suggested the exam might be easy.",
      "The professor was unsure about the exam's difficulty.",
      "The professor directly stated the exam would be challenging.",
      "The professor hinted that the exam would be challenging."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves the indirect communication ('implied'/'hinted') and the same content about the exam being difficult/challenging.",
    "difficulty": "medium",
    "id": 3645
  },
  {
    "type": "restatement",
    "text": "Original: 'Having finished the project ahead of schedule, the team was praised by management.'",
    "options": [
      "After receiving praise, the team completed the project early.",
      "The team received praise from management for completing the project early.",
      "Management finished the project ahead of schedule and praised the team.",
      "The team was criticized for rushing through the project."
    ],
    "correctAnswer": 1,
    "explanation": "This option maintains both key elements: the early completion of the project and the resulting praise from management, in the same cause-effect relationship.",
    "difficulty": "medium",
    "id": 3646
  },
  {
    "type": "restatement",
    "text": "Original: 'Unless we take immediate action, the consequences could be irreversible.'",
    "options": [
      "The consequences are already irreversible despite our actions.",
      "The consequences will be reversible if we wait longer.",
      "Taking immediate action guarantees reversible consequences.",
      "If we don't act right away, we might face permanent consequences."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves the conditional relationship between not taking immediate action and facing potentially permanent consequences, just phrased differently.",
    "difficulty": "medium",
    "id": 3647
  },
  {
    "type": "restatement",
    "text": "Original: 'She not only wrote the report but also presented it to the board.'",
    "options": [
      "She presented the report to the board after someone else wrote it.",
      "She wrote the report but someone else presented it.",
      "She considered writing the report and presenting it.",
      "She both authored the report and delivered the presentation to the board."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains that she performed both actions (writing and presenting) and preserves the relationship between these two accomplishments and their target (the board).",
    "difficulty": "medium",
    "id": 3648
  },
  {
    "type": "restatement",
    "text": "Original: 'Although he had studied extensively, he still failed the examination.'",
    "options": [
      "He studied extensively after failing the examination.",
      "He failed the examination, which was surprising considering how much he had studied.",
      "He didn't study enough, which is why he failed the examination.",
      "He passed the examination because he had studied extensively."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the contrast between the extensive studying and the unexpected negative outcome of failing, maintaining the sense of surprise or contradiction.",
    "difficulty": "medium",
    "id": 3649
  },
  {
    "type": "restatement",
    "text": "Original: 'The new policy will be implemented gradually over the next six months.'",
    "options": [
      "The new policy will be immediately put into full effect.",
      "The new policy will be reviewed after six months of implementation.",
      "Over the course of six months, the new policy will be phased in step by step.",
      "The implementation of the new policy will be delayed for six months."
    ],
    "correctAnswer": 2,
    "explanation": "This option preserves the incremental nature of the implementation ('gradually'/'phased in step by step') and maintains the same timeframe of six months.",
    "difficulty": "medium",
    "id": 3650
  },
  {
    "type": "restatement",
    "text": "Original: 'Contrary to popular belief, the restaurant's signature dish contains no garlic.'",
    "options": [
      "The restaurant recently removed garlic from their signature dish.",
      "Most people correctly believe the restaurant's signature dish is garlic-free.",
      "The restaurant's popular dish contains a significant amount of garlic.",
      "Many people mistakenly think that garlic is an ingredient in the restaurant's signature dish."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains both the misconception held by many people and the factual assertion that the dish does not contain garlic, preserving the contrast between belief and reality.",
    "difficulty": "medium",
    "id": 3651
  },
  {
    "type": "restatement",
    "text": "Original: 'The museum is accessible to visitors with disabilities, as it has ramps and elevators.'",
    "options": [
      "Visitors with disabilities can access the museum because it is equipped with ramps and elevators.",
      "The museum has limited accessibility despite having ramps and elevators.",
      "The museum plans to install ramps and elevators to become accessible.",
      "The museum's ramps and elevators are only for staff use, not visitors with disabilities."
    ],
    "correctAnswer": 0,
    "explanation": "This option maintains that the museum is accessible to people with disabilities and preserves the causal relationship that this accessibility is due to the presence of ramps and elevators.",
    "difficulty": "medium",
    "id": 3652
  },
  {
    "type": "restatement",
    "text": "Original: 'While initially skeptical, the committee eventually approved the proposal unanimously.'",
    "options": [
      "The proposal was approved, but several committee members continued to express doubts.",
      "After some initial doubts, the entire committee came to support the proposal.",
      "The committee was immediately supportive of the proposal from the beginning.",
      "The committee remained skeptical and rejected the proposal."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves both the initial negative attitude (skepticism/doubts) and the subsequent complete acceptance (unanimous approval/entire committee support), maintaining the shift in opinion.",
    "difficulty": "medium",
    "id": 3653
  },
  {
    "type": "restatement",
    "text": "Original: 'The museum closes at 5 PM, so we should arrive by 3 PM at the latest.'",
    "options": [
      "We should arrive at the museum at 5 PM when it closes.",
      "To have enough time at the museum, we need to get there no later than 3 PM.",
      "We can visit the museum anytime before 5 PM.",
      "The museum opens at 3 PM and closes at 5 PM."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the logical relationship that arriving by 3 PM is necessary because the museum closes at 5 PM, implying a need for sufficient visiting time.",
    "difficulty": "medium",
    "id": 3655
  },
  {
    "type": "restatement",
    "text": "Original: 'Having finished all her assignments, Sarah decided to reward herself with a movie night.'",
    "options": [
      "Sarah watched a movie while completing her assignments.",
      "Sarah couldn't finish her assignments because she wanted to watch a movie.",
      "After completing all her work, Sarah treated herself to watching movies.",
      "Sarah was too tired from her assignments to enjoy a movie night."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the sequential relationship where Sarah first completed all her work and then rewarded herself with movies as a treat afterward.",
    "difficulty": "medium",
    "id": 3656
  },
  {
    "type": "restatement",
    "text": "Original: 'The company not only increased salaries but also improved healthcare benefits.'",
    "options": [
      "The company plans to increase salaries and improve healthcare in the future.",
      "The company improved healthcare benefits instead of increasing salaries.",
      "The company increased salaries but reduced healthcare benefits.",
      "The company enhanced both salary packages and healthcare coverage."
    ],
    "correctAnswer": 3,
    "explanation": "This option correctly captures that the company made improvements in two areas simultaneously: higher salaries and better healthcare benefits.",
    "difficulty": "medium",
    "id": 3657
  },
  {
    "type": "restatement",
    "text": "Original: 'Unless you practice regularly, you won't improve your piano skills.'",
    "options": [
      "You should practice regularly even though it won't improve your piano skills.",
      "Regular practice might not be enough to improve your piano skills.",
      "Your piano skills will improve without regular practice.",
      "You will improve your piano skills only if you practice regularly."
    ],
    "correctAnswer": 3,
    "explanation": "This option correctly expresses the conditional relationship that regular practice is a necessary condition for improving piano skills.",
    "difficulty": "medium",
    "id": 3658
  },
  {
    "type": "restatement",
    "text": "Original: 'While the book was critically acclaimed, it didn't sell well commercially.'",
    "options": [
      "Critics and commercial audiences both enjoyed the book tremendously.",
      "The book received negative reviews but was commercially successful.",
      "The book received positive critical reviews but had poor sales figures.",
      "The book wasn't reviewed by critics but sold many copies."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the contrast between critical success (positive reviews) and commercial performance (poor sales) expressed in the original sentence.",
    "difficulty": "medium",
    "id": 3659
  },
  {
    "type": "restatement",
    "text": "Original: 'The renovation project is taking longer than anticipated, but the results will be worth the wait.'",
    "options": [
      "The renovation results are disappointing considering how long the project has taken.",
      "The renovation project should be abandoned because it's taking too long.",
      "The renovation project is proceeding faster than expected with excellent results.",
      "Despite delays in the renovation timeline, the final outcome will justify the extended duration."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves both aspects of the original: the project is delayed beyond expectations, yet there's optimism that the final results will compensate for the longer timeframe.",
    "difficulty": "medium",
    "id": 3660
  },
  {
    "type": "restatement",
    "text": "Original: 'She hardly ever speaks in public, which is why her presentation surprised everyone.'",
    "options": [
      "Her presentation was surprising because she frequently speaks in public.",
      "Her presentation was poor because she rarely speaks in public.",
      "Her presentation was unexpected because she rarely speaks in front of others.",
      "Everyone was surprised that she refused to give the presentation."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the causal relationship between her rarely speaking publicly and the surprise her presentation caused among the audience.",
    "difficulty": "medium",
    "id": 3661
  },
  {
    "type": "restatement",
    "text": "Original: 'Although they had never met in person before, they recognized each other immediately.'",
    "options": [
      "They arranged to meet in person so they could finally recognize each other.",
      "They had trouble recognizing each other when they met for the first time.",
      "Despite having met several times before, they couldn't recognize each other.",
      "They knew who each other was right away, even though this was their first face-to-face meeting."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves the contrast between never having met physically before and the immediate mutual recognition that occurred when they did meet.",
    "difficulty": "medium",
    "id": 3662
  },
  {
    "type": "restatement",
    "text": "Original: 'Not until she arrived home did she realize she had left her phone at the restaurant.'",
    "options": [
      "She remembered to bring her phone home from the restaurant.",
      "The restaurant called to tell her she had left her phone there.",
      "She discovered her phone was missing only after she got home.",
      "She realized she had forgotten her phone before leaving the restaurant."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the timing element where the realization about the forgotten phone occurred specifically upon arriving home, not before.",
    "difficulty": "medium",
    "id": 3663
  },
  {
    "type": "restatement",
    "text": "Original: 'The professor insisted that all assignments be submitted by Friday.'",
    "options": [
      "The professor preferred that assignments be completed before the weekend.",
      "The professor demanded that students turn in all assignments no later than Friday.",
      "The professor allowed students to submit assignments after Friday.",
      "The professor suggested Friday would be a good deadline for assignments."
    ],
    "correctAnswer": 1,
    "explanation": "This option captures the mandatory nature implied by 'insisted' and maintains the strict Friday deadline requirement for all assignments.",
    "difficulty": "medium",
    "id": 3665
  },
  {
    "type": "restatement",
    "text": "Original: 'Having finished her work early, Sarah decided to help her colleagues.'",
    "options": [
      "Sarah's colleagues helped her finish her work early.",
      "Sarah was too busy with her own work to help her colleagues.",
      "After completing her own tasks ahead of schedule, Sarah offered assistance to her coworkers.",
      "Sarah helped her colleagues, which allowed her to finish her work early."
    ],
    "correctAnswer": 2,
    "explanation": "This option preserves the sequence of events and causality - Sarah first completed her work ahead of time, which then led to her decision to assist others.",
    "difficulty": "medium",
    "id": 3666
  },
  {
    "type": "restatement",
    "text": "Original: 'The company has been gradually phasing out plastic packaging since last year.'",
    "options": [
      "The company plans to eliminate plastic packaging next year.",
      "The company recently began considering alternatives to plastic packaging.",
      "The company stopped using all plastic packaging last year.",
      "Since last year, the company has been slowly reducing its use of plastic packaging."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the key concept of an ongoing, incremental reduction of plastic packaging that began last year and continues into the present.",
    "difficulty": "medium",
    "id": 3667
  },
  {
    "type": "restatement",
    "text": "Original: 'The documentary not only entertained viewers but also educated them about climate change.'",
    "options": [
      "The documentary was primarily educational with some entertaining elements about climate change.",
      "Viewers found the documentary on climate change to be entertaining rather than educational.",
      "The documentary failed to entertain viewers despite its educational content about climate change.",
      "The documentary served dual purposes: providing entertainment while simultaneously informing viewers about climate change."
    ],
    "correctAnswer": 3,
    "explanation": "This option accurately captures the dual nature of the documentary expressed in the original - it both entertained and educated, without prioritizing one function over the other.",
    "difficulty": "medium",
    "id": 3668
  },
  {
    "type": "restatement",
    "text": "Original: 'Unless we receive additional funding, the project cannot be completed on time.'",
    "options": [
      "The project requires less funding to be completed on schedule.",
      "The project will be completed on time only if we secure more funding.",
      "We need to complete the project on time to receive additional funding.",
      "The project will be delayed regardless of whether we receive additional funding."
    ],
    "correctAnswer": 1,
    "explanation": "This option correctly preserves the conditional relationship - obtaining more funding is presented as the necessary condition for timely completion of the project.",
    "difficulty": "medium",
    "id": 3669
  },
  {
    "type": "restatement",
    "text": "Original: 'While some critics praised the novel's innovative style, others found it confusing.'",
    "options": [
      "The novel's style was neither innovative nor confusing according to critics.",
      "Critics were unanimous in their praise of the novel's clear and innovative style.",
      "All critics agreed that the novel's style was both innovative and confusing.",
      "The novel's style received mixed reviews, with some critics appreciating its innovation and others being confused by it."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the contrast between two different critical perspectives on the novel's style - one group finding it innovative, the other finding it confusing.",
    "difficulty": "medium",
    "id": 3670
  },
  {
    "type": "restatement",
    "text": "Original: 'Having neglected regular maintenance, they shouldn't have been surprised when the machine broke down.'",
    "options": [
      "The machine broke down unexpectedly even though they performed regular maintenance.",
      "They were shocked when the machine broke down despite regular maintenance.",
      "They maintained the machine regularly to prevent it from breaking down.",
      "The machine's breakdown was a predictable outcome of their failure to maintain it properly."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves the cause-effect relationship between neglecting maintenance and the machine's breakdown, along with the implication that this outcome should have been anticipated.",
    "difficulty": "medium",
    "id": 3671
  },
  {
    "type": "restatement",
    "text": "Original: 'The research suggests a correlation between sleep patterns and academic performance, but not necessarily causation.'",
    "options": [
      "The research concludes that academic performance determines sleep patterns.",
      "The research indicates that sleep patterns might affect academic performance, but hasn't established a definitive causal link.",
      "According to the research, sleep patterns and academic performance are completely unrelated.",
      "The research proves that poor sleep directly causes lower academic performance."
    ],
    "correctAnswer": 1,
    "explanation": "This option accurately reflects the nuanced finding - a relationship exists between the variables, but the research doesn't claim that one definitively causes the other.",
    "difficulty": "medium",
    "id": 3672
  },
  {
    "type": "restatement",
    "text": "Original: 'Rather than accepting the first offer, she decided to negotiate for better terms.'",
    "options": [
      "She immediately accepted the first offer without attempting to negotiate.",
      "She made the first offer and was unwilling to negotiate further.",
      "Instead of taking the initial offer, she chose to bargain for more favorable conditions.",
      "She rejected all offers including those with better terms."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the key action (choosing negotiation) and the implied rejection of the initial offer in favor of pursuing improved terms through discussion.",
    "difficulty": "medium",
    "id": 3673
  },
  {
    "type": "restatement",
    "text": "Original: 'The professor claimed that the assignment was straightforward, but most students found it challenging.'",
    "options": [
      "According to the professor, the assignment was complex, contrary to what students believed.",
      "The professor and students agreed that the assignment was difficult to complete.",
      "Most students disagreed with the professor about the difficulty of the assignment.",
      "Students found the assignment easy after the professor explained it clearly."
    ],
    "correctAnswer": 2,
    "explanation": "This option preserves the contrast between the professor's perspective (straightforward) and the students' experience (challenging), maintaining the original contradiction.",
    "difficulty": "medium",
    "id": 3675
  },
  {
    "type": "restatement",
    "text": "Original: 'Having finished all her tasks early, Sarah decided to help her colleagues.'",
    "options": [
      "Sarah's colleagues asked for her assistance with their tasks.",
      "After completing her responsibilities ahead of schedule, Sarah offered assistance to her coworkers.",
      "Sarah worked overtime to finish her tasks and help others.",
      "Sarah helped her colleagues instead of completing her own tasks."
    ],
    "correctAnswer": 1,
    "explanation": "This option maintains the sequence of events and causal relationship - Sarah completed her work early, which then enabled her to assist others.",
    "difficulty": "medium",
    "id": 3676
  },
  {
    "type": "restatement",
    "text": "Original: 'The company has not only increased its profits but also expanded its market share.'",
    "options": [
      "The company expanded its market presence at the expense of profitability.",
      "The company's profits rose while its market share remained stable.",
      "The company achieved both higher profits and greater market presence.",
      "Despite increasing profits, the company lost some of its market share."
    ],
    "correctAnswer": 2,
    "explanation": "This option captures both positive developments mentioned in the original - increased profits and expanded market share - without changing their relationship.",
    "difficulty": "medium",
    "id": 3677
  },
  {
    "type": "restatement",
    "text": "Original: 'Although initially skeptical, the critics eventually praised the director's unconventional approach.'",
    "options": [
      "Despite early doubts, the critics ultimately appreciated the director's unique methods.",
      "The director's conventional style was consistently praised by critics.",
      "The critics' initial praise for the director's approach later turned to skepticism.",
      "The critics remained divided about the merits of the director's unusual techniques."
    ],
    "correctAnswer": 0,
    "explanation": "This option accurately captures the shift from initial skepticism to eventual praise, maintaining the chronological progression and attitude change of the critics.",
    "difficulty": "medium",
    "id": 3678
  },
  {
    "type": "restatement",
    "text": "Original: 'The new policy will be implemented gradually rather than immediately.'",
    "options": [
      "The new policy replaces the gradual implementation approach previously planned.",
      "The new policy will take effect right away with no transition period.",
      "The implementation of the new policy will occur in phases over time.",
      "Officials are still debating whether to implement the new policy."
    ],
    "correctAnswer": 2,
    "explanation": "This option correctly conveys the incremental implementation approach, contrasting with an immediate rollout, which aligns with the original statement's meaning.",
    "difficulty": "medium",
    "id": 3679
  },
  {
    "type": "restatement",
    "text": "Original: 'Unless we receive additional funding, the project cannot be completed on schedule.'",
    "options": [
      "The project's schedule depends on reducing costs rather than increasing funding.",
      "We need more time, not more funding, to complete the project.",
      "The project will be completed on time regardless of funding issues.",
      "Extra funding is necessary for the project's timely completion."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the conditional relationship between funding and timely completion, expressing that additional financial resources are a prerequisite for meeting the schedule.",
    "difficulty": "medium",
    "id": 3680
  },
  {
    "type": "restatement",
    "text": "Original: 'The research indicates a correlation between sleep quality and academic performance, but not necessarily causation.'",
    "options": [
      "The research proves that academic performance has no relationship with sleep quality.",
      "The research shows that sleep quality and academic performance are related, though one may not cause the other.",
      "Better sleep quality directly causes improved academic results according to the research.",
      "According to the research, academic performance influences how well students sleep."
    ],
    "correctAnswer": 1,
    "explanation": "This option correctly distinguishes between correlation and causation, noting the relationship between the variables without claiming that one directly causes the other.",
    "difficulty": "medium",
    "id": 3681
  },
  {
    "type": "restatement",
    "text": "Original: 'While the novel was critically acclaimed, it failed to achieve commercial success.'",
    "options": [
      "Critics disliked the novel despite its popularity with readers.",
      "The novel received positive reviews but didn't sell well.",
      "The novel's commercial success eventually led to critical recognition.",
      "The novel was both a critical and commercial disappointment."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the contrast between critical reception (positive) and commercial performance (negative) that was central to the original statement.",
    "difficulty": "medium",
    "id": 3682
  },
  {
    "type": "restatement",
    "text": "Original: 'The candidate's speech addressed economic concerns without offering specific solutions.'",
    "options": [
      "The candidate's speech focused on solutions rather than economic problems.",
      "The candidate proposed detailed solutions to economic problems.",
      "The candidate avoided discussing economic issues during the speech.",
      "The candidate discussed economic issues but didn't provide concrete remedies."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the key elements of the original - that economic concerns were discussed but specific solutions were absent from the speech.",
    "difficulty": "medium",
    "id": 3683
  },
  {
    "type": "restatement",
    "text": "Original: 'The professor claimed that the theory was revolutionary, but many experts disagreed.'",
    "options": [
      "Many experts supported the professor's claim about the revolutionary theory.",
      "The revolutionary theory was rejected by the professor but accepted by experts.",
      "While the professor considered the theory revolutionary, numerous experts held contrary views.",
      "The professor and many experts agreed the theory was revolutionary."
    ],
    "correctAnswer": 2,
    "explanation": "This option preserves the contrast between the professor's positive assessment of the theory and the opposing viewpoint held by many experts.",
    "difficulty": "medium",
    "id": 3685
  },
  {
    "type": "restatement",
    "text": "Original: 'Having finished the project ahead of schedule, the team was awarded a bonus.'",
    "options": [
      "The team received extra compensation because they completed the project early.",
      "The team's bonus was contingent on finishing the project on time.",
      "Although the team finished early, they did not receive any bonus.",
      "The team worked overtime to finish the project and earn a bonus."
    ],
    "correctAnswer": 0,
    "explanation": "This option maintains the causal relationship between early completion and receiving a bonus, using different wording while preserving the original meaning.",
    "difficulty": "medium",
    "id": 3686
  },
  {
    "type": "restatement",
    "text": "Original: 'Not only did she win the competition, but she also set a new record.'",
    "options": [
      "She won the competition by breaking the previous record.",
      "She either won the competition or set a new record, but not both.",
      "She achieved two accomplishments: winning the competition and establishing a new record.",
      "She didn't win the competition but managed to set a new record."
    ],
    "correctAnswer": 2,
    "explanation": "This option correctly captures both achievements mentioned in the original sentence - winning the competition and setting a new record - without changing their relationship.",
    "difficulty": "medium",
    "id": 3687
  },
  {
    "type": "restatement",
    "text": "Original: 'Unless the government intervenes, the economic crisis will worsen.'",
    "options": [
      "The economic crisis will improve only with government intervention.",
      "If the government takes action, the economic crisis will definitely worsen.",
      "Government intervention is unlikely to affect the economic crisis.",
      "The government's intervention will prevent the economic crisis from deteriorating."
    ],
    "correctAnswer": 3,
    "explanation": "This option correctly expresses the conditional relationship that government action would prevent the worsening of the crisis, which is the logical equivalent of the original statement.",
    "difficulty": "medium",
    "id": 3688
  },
  {
    "type": "restatement",
    "text": "Original: 'She rarely speaks in public, as she suffers from severe anxiety.'",
    "options": [
      "She has severe anxiety but it doesn't affect her public speaking.",
      "She speaks in public to overcome her severe anxiety.",
      "Despite her severe anxiety, she frequently speaks in public.",
      "Her severe anxiety is the reason she seldom gives public speeches."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the causal relationship between her anxiety and infrequent public speaking, using different wording while preserving the same meaning.",
    "difficulty": "medium",
    "id": 3689
  },
  {
    "type": "restatement",
    "text": "Original: 'The documentary, which won several awards, exposed corruption in the pharmaceutical industry.'",
    "options": [
      "The award-winning documentary was criticized for its portrayal of the pharmaceutical industry.",
      "The pharmaceutical industry created a documentary that won several awards.",
      "A documentary revealing pharmaceutical industry corruption received multiple awards.",
      "Several awards were given to documentaries about corruption in the pharmaceutical industry."
    ],
    "correctAnswer": 2,
    "explanation": "This option retains both key facts about the documentary: that it exposed corruption in the pharmaceutical industry and that it received multiple awards.",
    "difficulty": "medium",
    "id": 3690
  },
  {
    "type": "restatement",
    "text": "Original: 'Although initially skeptical, the investors eventually backed the startup.'",
    "options": [
      "The startup was skeptical about accepting support from the investors.",
      "The startup gained investor support despite initial reservations.",
      "The investors remained skeptical and refused to support the startup.",
      "The investors immediately recognized the startup's potential and provided backing."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the contrast between the investors' initial doubt and their ultimate decision to support the startup, maintaining the original meaning.",
    "difficulty": "medium",
    "id": 3691
  },
  {
    "type": "restatement",
    "text": "Original: 'The novel's ambiguous ending has been interpreted in various ways by literary critics.'",
    "options": [
      "Literary critics have offered different explanations for the novel's unclear conclusion.",
      "The author clarified the novel's ending after literary critics expressed confusion.",
      "The novel ended abruptly, disappointing many literary critics.",
      "Literary critics agree on the meaning of the novel's clear ending."
    ],
    "correctAnswer": 0,
    "explanation": "This option maintains the key idea that the novel's ending is open to multiple interpretations and that literary critics have provided different analyses of it.",
    "difficulty": "medium",
    "id": 3692
  },
  {
    "type": "restatement",
    "text": "Original: 'By reducing our carbon footprint, we can mitigate the effects of climate change.'",
    "options": [
      "Increasing our carbon footprint will solve the climate change crisis.",
      "The effects of climate change are entirely unrelated to carbon footprints.",
      "Climate change is inevitable regardless of our carbon footprint.",
      "Decreasing our carbon emissions may help lessen climate change impacts."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves the causal relationship between reducing carbon emissions and lessening climate change effects, using different wording while maintaining the original meaning.",
    "difficulty": "medium",
    "id": 3693
  },
  {
    "type": "restatement",
    "text": "Original: 'The professor insisted that all students submit their assignments by Friday.'",
    "options": [
      "The professor suggested Friday as a possible deadline for assignments.",
      "The professor firmly required all assignments to be turned in no later than Friday.",
      "Students were encouraged to turn in their work before the weekend.",
      "Friday was when most students chose to submit their assignments."
    ],
    "correctAnswer": 1,
    "explanation": "This option captures the mandatory nature conveyed by 'insisted' and maintains the strict deadline of Friday that applies to all students.",
    "difficulty": "medium",
    "id": 3695
  },
  {
    "type": "restatement",
    "text": "Original: 'The documentary reveals how climate change affects coastal communities.'",
    "options": [
      "Coastal communities created a documentary about potential climate change.",
      "Coastal communities are causing climate change according to a new documentary.",
      "The documentary argues that climate change is not affecting coastal areas.",
      "A documentary exposes the impact of climate change on communities near the coast."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the documentary as the subject that is showing information about climate change's effects specifically on coastal communities.",
    "difficulty": "medium",
    "id": 3699
  },
  {
    "type": "restatement",
    "text": "Original: 'Although they had never met before, they felt an immediate connection.'",
    "options": [
      "They eventually developed a connection after meeting multiple times.",
      "They felt connected because they had met several times previously.",
      "Despite being strangers, they experienced an instant rapport.",
      "They met for the first time but didn't feel any particular bond."
    ],
    "correctAnswer": 2,
    "explanation": "This option preserves the contrast between their status as strangers and the unexpected immediacy of their connection, capturing the original meaning.",
    "difficulty": "medium",
    "id": 3700
  },
  {
    "type": "restatement",
    "text": "Original: 'The research indicates a correlation between sleep patterns and academic performance.'",
    "options": [
      "The study suggests sleep patterns might be related to how well students perform academically.",
      "According to research, academic performance determines sleep patterns.",
      "Researchers have proven that sleep has no effect on academic results.",
      "Research shows that changing sleep patterns will guarantee better grades."
    ],
    "correctAnswer": 0,
    "explanation": "This option maintains the neutral reporting of a relationship between the two factors without implying causation or certainty, staying true to the original meaning.",
    "difficulty": "medium",
    "id": 3701
  },
  {
    "type": "restatement",
    "text": "Original: 'By the time we arrived at the theater, the movie had already started.'",
    "options": [
      "We got to the theater just as the movie was beginning.",
      "When we reached the theater, the movie was already in progress.",
      "We arrived at the theater before the movie started.",
      "The movie began after we reached the theater."
    ],
    "correctAnswer": 1,
    "explanation": "This option correctly preserves the sequence of events: the movie starting first, followed by our arrival, indicating we missed the beginning of the film.",
    "difficulty": "medium",
    "id": 3702
  },
  {
    "type": "restatement",
    "text": "Original: 'The city council unanimously approved the proposal to build a new community center.'",
    "options": [
      "All members of the city council voted in favor of the community center plan.",
      "The community forced the city council to approve a new center.",
      "The city council debated whether to approve the community center proposal.",
      "Most city council members voted to construct a community center."
    ],
    "correctAnswer": 0,
    "explanation": "This option accurately captures that every council member voted to approve the proposal, which is what 'unanimously approved' means in the original sentence.",
    "difficulty": "medium",
    "id": 3703
  },
  {
    "type": "restatement",
    "text": "Original: 'The company has decided to implement a new policy starting next month.'",
    "options": [
      "A new policy will take effect next month as decided by the company.",
      "Next month, a new policy might be introduced by the company.",
      "The company delayed implementing the new policy until next year.",
      "The company is considering a policy change for next month."
    ],
    "correctAnswer": 0,
    "explanation": "The statement indicating a definite decision that has already been made and specifying the exact timing (next month) maintains the original meaning.",
    "difficulty": "medium",
    "id": 3705
  },
  {
    "type": "restatement",
    "text": "Original: 'Having finished all her assignments, Sarah decided to take a short break.'",
    "options": [
      "After completing all her assignments, Sarah chose to rest briefly.",
      "Sarah planned to finish her assignments after taking a break.",
      "Sarah needed a break because she was exhausted from her assignments.",
      "Sarah took a break while working on her assignments."
    ],
    "correctAnswer": 0,
    "explanation": "The statement preserves the sequence of events (completion first, then break) and maintains that Sarah actively chose to rest after finishing everything.",
    "difficulty": "medium",
    "id": 3706
  },
  {
    "type": "restatement",
    "text": "Original: 'The museum is free on Sundays, but donations are appreciated.'",
    "options": [
      "The museum charges an entrance fee except on Sundays.",
      "The museum suggests visiting on Sundays to avoid paying.",
      "Donations are required when visiting the museum on Sundays.",
      "While there's no admission charge on Sundays, the museum welcomes contributions."
    ],
    "correctAnswer": 3,
    "explanation": "This statement maintains both key elements: that Sunday admission has no cost and that voluntary contributions are still welcomed by the museum.",
    "difficulty": "medium",
    "id": 3707
  },
  {
    "type": "restatement",
    "text": "Original: 'She not only speaks French fluently but also knows Italian and Spanish.'",
    "options": [
      "She occasionally speaks French, Italian, and Spanish.",
      "She speaks French better than Italian and Spanish.",
      "Besides being fluent in French, she has knowledge of Italian and Spanish.",
      "She is learning to speak French, Italian, and Spanish."
    ],
    "correctAnswer": 2,
    "explanation": "The statement maintains that French fluency is one of her abilities while also acknowledging her knowledge of two additional languages, preserving the original meaning.",
    "difficulty": "medium",
    "id": 3708
  },
  {
    "type": "restatement",
    "text": "Original: 'The doctor advised him to avoid strenuous exercise until his injury heals.'",
    "options": [
      "His doctor prohibited all forms of exercise due to his injury.",
      "The doctor suggested he do light exercise to help his injury heal faster.",
      "The doctor recommended strenuous exercise after his injury heals completely.",
      "According to the doctor, he should refrain from intense physical activity while his injury recovers."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves the medical advice against vigorous activity and maintains the temporary nature of the restriction until recovery occurs.",
    "difficulty": "medium",
    "id": 3709
  },
  {
    "type": "restatement",
    "text": "Original: 'Although they disagreed on many issues, they managed to reach a compromise.'",
    "options": [
      "Despite having numerous points of contention, they worked out a mutually acceptable solution.",
      "Their disagreements prevented them from finding any common ground.",
      "They postponed resolving their disagreements until later.",
      "They agreed on everything and easily found a solution."
    ],
    "correctAnswer": 0,
    "explanation": "This statement maintains the contrast between their many disagreements and their ultimate success in finding a middle ground that both could accept.",
    "difficulty": "medium",
    "id": 3710
  },
  {
    "type": "restatement",
    "text": "Original: 'The report indicates that climate change is accelerating faster than previously predicted.'",
    "options": [
      "According to new predictions, climate change might accelerate in the future.",
      "The report confirms that climate change is happening at the expected rate.",
      "Previous predictions about climate change have been proven completely wrong.",
      "The report shows climate change is progressing more rapidly than earlier forecasts suggested."
    ],
    "correctAnswer": 3,
    "explanation": "This statement preserves the comparison between current data and earlier predictions, maintaining that the pace of climate change exceeds what was previously anticipated.",
    "difficulty": "medium",
    "id": 3711
  },
  {
    "type": "restatement",
    "text": "Original: 'The restaurant was so crowded that we had to wait an hour for a table.'",
    "options": [
      "Due to the restaurant being full, we endured a one-hour wait to be seated.",
      "The restaurant gave us a table immediately despite being crowded.",
      "We decided not to wait when we saw how crowded the restaurant was.",
      "We waited an hour at the restaurant because the service was slow."
    ],
    "correctAnswer": 0,
    "explanation": "This statement maintains the causal relationship between the crowded condition and the lengthy wait time, preserving the original meaning exactly.",
    "difficulty": "medium",
    "id": 3712
  },
  {
    "type": "restatement",
    "text": "Original: 'Ever since the renovation, the hotel has attracted more high-profile guests.'",
    "options": [
      "The hotel is currently being renovated to attract celebrity guests.",
      "High-profile guests funded the hotel's recent renovation project.",
      "The hotel's renovation was specifically designed for famous guests.",
      "Following its renovation, the hotel has seen an increase in prestigious clientele."
    ],
    "correctAnswer": 3,
    "explanation": "This statement preserves the temporal relationship (after renovation) and the resulting outcome (more distinguished guests), maintaining the original meaning exactly.",
    "difficulty": "medium",
    "id": 3713
  },
  {
    "type": "restatement",
    "text": "Original: 'The CEO announced that the company would be restructuring in the coming months.'",
    "options": [
      "The CEO confirmed that restructuring had already begun within the company.",
      "The CEO denied rumors about potential company restructuring.",
      "The CEO suggested that restructuring might be necessary eventually.",
      "The CEO declared the company would undergo reorganization in the near future."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves the certainty of the announcement and maintains the future timeframe for the restructuring process, keeping the original meaning intact.",
    "difficulty": "medium",
    "id": 3715
  },
  {
    "type": "restatement",
    "text": "Original: 'The museum is not only educational but also entertaining for visitors of all ages.'",
    "options": [
      "The museum's educational content outweighs its entertainment value.",
      "The museum primarily focuses on entertainment rather than education.",
      "The museum offers both educational value and entertainment to people of any age.",
      "The museum is educational for adults but entertaining only for children."
    ],
    "correctAnswer": 2,
    "explanation": "This option correctly captures the dual nature of the museum (educational and entertaining) and maintains that these qualities apply to visitors of all ages.",
    "difficulty": "medium",
    "id": 3717
  },
  {
    "type": "restatement",
    "text": "Original: 'Unless we receive additional funding, the project will have to be abandoned.'",
    "options": [
      "We've already abandoned the project due to lack of funding.",
      "We need more money or we'll have to stop the project.",
      "The project will continue regardless of funding issues.",
      "Additional funding will guarantee the project's completion."
    ],
    "correctAnswer": 1,
    "explanation": "This option maintains the conditional relationship between receiving funding and continuing the project, expressing the same consequence if funding isn't secured.",
    "difficulty": "medium",
    "id": 3718
  },
  {
    "type": "restatement",
    "text": "Original: 'Although she had never climbed before, Emma reached the summit faster than experienced hikers.'",
    "options": [
      "Emma and the experienced hikers reached the summit at the same time.",
      "Despite being a novice climber, Emma ascended to the top more rapidly than seasoned hikers.",
      "Emma was an experienced climber who reached the summit quickly.",
      "Emma climbed slowly because she lacked experience."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the contrast between Emma's lack of climbing experience and her surprisingly fast ascent compared to more experienced hikers.",
    "difficulty": "medium",
    "id": 3719
  },
  {
    "type": "restatement",
    "text": "Original: 'The new policy has been met with resistance from both employees and management.'",
    "options": [
      "The new policy has been opposed by staff at all levels of the organization.",
      "Employees have embraced the new policy while management remains skeptical.",
      "Management supports the new policy despite employee resistance.",
      "The new policy will be revised due to widespread opposition."
    ],
    "correctAnswer": 0,
    "explanation": "This option accurately conveys that opposition to the policy exists among both regular employees and those in leadership positions, maintaining the original meaning.",
    "difficulty": "medium",
    "id": 3720
  },
  {
    "type": "restatement",
    "text": "Original: 'The research indicates a correlation between sleep quality and academic performance.'",
    "options": [
      "The research proves that better sleep directly causes improved academic results.",
      "The research found no significant connection between sleep patterns and academic achievement.",
      "According to the research, there appears to be a relationship between how well one sleeps and how well one performs academically.",
      "The research suggests that academic performance is more important than sleep quality."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the research finding of a relationship between sleep quality and academic performance without overstating it as causation or understating the connection.",
    "difficulty": "medium",
    "id": 3721
  },
  {
    "type": "restatement",
    "text": "Original: 'By the time the fire department arrived, the building had been completely destroyed.'",
    "options": [
      "The fire department arrived just in time to save the building.",
      "The fire department's delay contributed to the building's destruction.",
      "When the firefighters reached the scene, the building was already totally ruined.",
      "The building was partially damaged when the firefighters got there."
    ],
    "correctAnswer": 2,
    "explanation": "This option preserves the temporal relationship that the complete destruction of the building occurred before the fire department's arrival, maintaining the original meaning.",
    "difficulty": "medium",
    "id": 3722
  },
  {
    "type": "restatement",
    "text": "Original: 'While the novel received critical acclaim, it failed to achieve commercial success.'",
    "options": [
      "Critics disliked the novel, but it sold very well.",
      "The novel achieved both critical and commercial success.",
      "The novel was praised by critics but didn't sell well.",
      "The novel was neither critically acclaimed nor commercially successful."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the contrast between the positive critical reception and the disappointing sales performance, preserving the original meaning of the sentence.",
    "difficulty": "medium",
    "id": 3723
  },
  {
    "type": "restatement",
    "text": "Original: 'The company has been steadily expanding its operations in Asia.'",
    "options": [
      "The company is planning to enter the Asian market soon.",
      "The company's Asian operations have been growing consistently.",
      "The company's operations in Asia have remained stable.",
      "The company suddenly increased its presence in Asia."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the key ideas of continuous growth ('steadily') and the geographic focus on Asia, maintaining the original meaning exactly.",
    "difficulty": "medium",
    "id": 3725
  },
  {
    "type": "restatement",
    "text": "Original: 'She reluctantly agreed to chair the committee.'",
    "options": [
      "She refused to be part of the committee.",
      "She accepted the committee leadership position despite her hesitation.",
      "She was undecided about joining the committee.",
      "She was eager to lead the committee."
    ],
    "correctAnswer": 1,
    "explanation": "This option captures both her unwillingness ('reluctantly') and her ultimate acceptance of the leadership role ('chair'), preserving the original meaning.",
    "difficulty": "medium",
    "id": 3726
  },
  {
    "type": "restatement",
    "text": "Original: 'The professor emphasized the importance of critical thinking.'",
    "options": [
      "The professor required students to think critically.",
      "The professor occasionally mentioned critical thinking.",
      "The professor stressed how vital critical thinking is.",
      "The professor questioned whether critical thinking matters."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the professor's action of highlighting significance ('stressed' = 'emphasized') and the subject matter (critical thinking's importance).",
    "difficulty": "medium",
    "id": 3727
  },
  {
    "type": "restatement",
    "text": "Original: 'Many experts believe artificial intelligence will transform healthcare within a decade.'",
    "options": [
      "Some specialists think AI might slightly improve healthcare eventually.",
      "All researchers agree that AI will completely replace healthcare workers soon.",
      "Most professionals doubt AI will have any impact on healthcare.",
      "A significant number of authorities think AI will revolutionize healthcare in the next ten years."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the quantifier ('many' = 'significant number'), the prediction about substantial change ('transform' = 'revolutionize'), and the timeframe ('within a decade' = 'in the next ten years').",
    "difficulty": "medium",
    "id": 3729
  },
  {
    "type": "restatement",
    "text": "Original: 'The museum acquired the painting for an undisclosed amount.'",
    "options": [
      "The museum borrowed the painting temporarily.",
      "The museum sold the painting for a secret sum.",
      "The museum displayed the painting without permission.",
      "The museum purchased the artwork but didn't reveal the price."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves the museum's action of obtaining ownership ('acquired' = 'purchased') and the private nature of the financial transaction ('undisclosed amount' = 'didn't reveal the price').",
    "difficulty": "medium",
    "id": 3730
  },
  {
    "type": "restatement",
    "text": "Original: 'The government has implemented stricter regulations to protect endangered species.'",
    "options": [
      "The government has enforced tougher rules designed to safeguard threatened animals.",
      "The government has reduced regulations concerning animal conservation.",
      "The government has documented which species are at risk of extinction.",
      "The government is considering new rules about wildlife protection."
    ],
    "correctAnswer": 0,
    "explanation": "This option maintains the government's completed action ('implemented' = 'enforced'), the increased severity ('stricter' = 'tougher'), and the conservation purpose ('protect endangered species' = 'safeguard threatened animals').",
    "difficulty": "medium",
    "id": 3731
  },
  {
    "type": "restatement",
    "text": "Original: 'The athlete overcame numerous obstacles to win the championship.'",
    "options": [
      "The athlete lost the championship despite trying hard.",
      "The athlete won the championship without any difficulties.",
      "The athlete trained extensively for the championship.",
      "The athlete faced many challenges but ultimately became the champion."
    ],
    "correctAnswer": 3,
    "explanation": "This option preserves both the athlete's struggle ('overcame numerous obstacles' = 'faced many challenges') and the successful outcome ('win the championship' = 'became the champion').",
    "difficulty": "medium",
    "id": 3732
  },
  {
    "type": "restatement",
    "text": "Original: 'The novel subtly explores themes of identity and belonging.'",
    "options": [
      "The novel delves into identity and belonging in an understated way.",
      "The novel avoids discussing serious themes altogether.",
      "The novel directly addresses political issues.",
      "The novel primarily focuses on action and adventure."
    ],
    "correctAnswer": 0,
    "explanation": "This option maintains the book's approach ('subtly' = 'in an understated way') and the specific thematic content ('explores themes of identity and belonging' = 'delves into identity and belonging').",
    "difficulty": "medium",
    "id": 3733
  },
  {
    "type": "restatement",
    "text": "Original: 'The company had to lay off employees due to financial constraints.'",
    "options": [
      "The company reduced salaries instead of firing anyone.",
      "Financial limitations forced the company to terminate some workers.",
      "Employees voluntarily left the company because of money issues.",
      "The company hired new employees despite financial problems."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the cause-effect relationship between financial problems and the involuntary termination of employees, maintaining the original meaning.",
    "difficulty": "medium",
    "id": 3735
  },
  {
    "type": "restatement",
    "text": "Original: 'She not only wrote the script but also directed the film.'",
    "options": [
      "She wrote the script after directing the film.",
      "She either wrote the script or directed the film, but not both.",
      "She directed the film but had no involvement in writing the script.",
      "She was responsible for both writing the script and directing the film."
    ],
    "correctAnswer": 3,
    "explanation": "This option correctly captures the dual role the person played, handling both script writing and directing responsibilities, which is exactly what the original sentence conveys.",
    "difficulty": "medium",
    "id": 3736
  },
  {
    "type": "restatement",
    "text": "Original: 'The professor implied that the exam would be challenging.'",
    "options": [
      "The professor was uncertain about the exam's difficulty level.",
      "The professor stated directly that the exam would be difficult.",
      "The professor assured students the exam would be easy.",
      "The professor suggested indirectly that the exam would be hard."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the indirect nature of communication ('implied' and 'suggested indirectly') while preserving the message about the exam being difficult.",
    "difficulty": "medium",
    "id": 3737
  },
  {
    "type": "restatement",
    "text": "Original: 'Unless we receive additional funding, the project will be terminated.'",
    "options": [
      "The project might be canceled even if we get more funding.",
      "The project needs less funding to continue.",
      "If we don't get more funding, the project will end.",
      "The project will continue regardless of funding issues."
    ],
    "correctAnswer": 2,
    "explanation": "This option correctly presents the conditional relationship: the negative outcome (project ending) will occur if the condition (receiving additional funding) is not met.",
    "difficulty": "medium",
    "id": 3738
  },
  {
    "type": "restatement",
    "text": "Original: 'The critics unanimously praised the novel for its innovative narrative style.'",
    "options": [
      "The critics were divided in their opinions about the novel's style.",
      "All the critics approved of the novel's unique storytelling method.",
      "The critics criticized the novel for being too conventional.",
      "Some critics liked the novel's storytelling approach."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves both the universal agreement ('unanimously' and 'all') and the positive assessment ('praised' and 'approved') of the novel's distinctive narrative approach.",
    "difficulty": "medium",
    "id": 3740
  },
  {
    "type": "restatement",
    "text": "Original: 'Although he had prepared thoroughly, James was nervous about the presentation.'",
    "options": [
      "James didn't prepare enough, which made him nervous about the presentation.",
      "James was confident about his presentation because he had prepared well.",
      "Despite his thorough preparation, James felt anxious about giving the presentation.",
      "James prepared thoroughly after feeling nervous about the presentation."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the contrast between James's thorough preparation and his nervousness, preserving the concessive relationship indicated by 'although' in the original.",
    "difficulty": "medium",
    "id": 3741
  },
  {
    "type": "restatement",
    "text": "Original: 'The research suggests a correlation between sleep quality and academic performance.'",
    "options": [
      "The research focuses primarily on academic performance rather than sleep patterns.",
      "According to the research, there appears to be a relationship between how well people sleep and how they perform academically.",
      "The research proves that better sleep directly causes improved grades.",
      "The research disproves any connection between sleep habits and school results."
    ],
    "correctAnswer": 1,
    "explanation": "This option maintains the tentative nature of the finding ('suggests' and 'appears to be') and preserves the relationship between the same two factors without implying causation.",
    "difficulty": "medium",
    "id": 3742
  },
  {
    "type": "restatement",
    "text": "Original: 'The museum has temporarily closed its doors for renovations.'",
    "options": [
      "The museum is closed for a limited time while improvements are being made.",
      "The museum will never undergo renovations because it's closing.",
      "The museum is permanently shut down due to structural problems.",
      "Visitors can still access the museum during the minor update work."
    ],
    "correctAnswer": 0,
    "explanation": "This option preserves both the temporary nature of the closure ('temporarily' and 'for a limited time') and the reason for it (renovations/improvements) from the original statement.",
    "difficulty": "medium",
    "id": 3743
  },
  {
    "type": "restatement",
    "text": "Original: 'The company has been struggling financially since the pandemic began.'",
    "options": [
      "The company was financially stable until the pandemic started.",
      "The pandemic caused the company to face economic challenges.",
      "The pandemic had no impact on the company's finances.",
      "The company has overcome its financial difficulties since the pandemic."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the core meaning that the company experienced financial difficulties as a direct result of the pandemic, maintaining the causal relationship and timing.",
    "difficulty": "medium",
    "id": 3745
  },
  {
    "type": "restatement",
    "text": "Original: 'She rarely speaks in public unless absolutely necessary.'",
    "options": [
      "She enjoys speaking in public on important occasions.",
      "She speaks in public only when she has no other choice.",
      "She never speaks in public under any circumstances.",
      "She frequently addresses public gatherings when invited."
    ],
    "correctAnswer": 1,
    "explanation": "This option captures the reluctance to speak publicly and the exceptional circumstances required, maintaining the meaning that public speaking is avoided except when unavoidable.",
    "difficulty": "medium",
    "id": 3746
  },
  {
    "type": "restatement",
    "text": "Original: 'Having finished his work early, John decided to help his colleagues.'",
    "options": [
      "After John helped his colleagues, he was able to finish his own work.",
      "Because John completed his tasks ahead of schedule, he offered assistance to his coworkers.",
      "John completed his colleagues' work because he had nothing else to do.",
      "John's colleagues finished early, so they helped him with his work."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the sequence of events and causal relationship: John's early completion of his own work led to his decision to assist others.",
    "difficulty": "medium",
    "id": 3749
  },
  {
    "type": "restatement",
    "text": "Original: 'While not perfect, the solution addresses most of our concerns.'",
    "options": [
      "The solution is flawless and resolves all our issues completely.",
      "The solution has serious flaws and doesn't address our main concerns.",
      "We need a perfect solution before we can address our concerns.",
      "Although the solution has some limitations, it resolves the majority of our issues."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the balanced assessment acknowledging both the solution's shortcomings and its effectiveness in handling most problems, preserving the original concessive relationship.",
    "difficulty": "medium",
    "id": 3750
  },
  {
    "type": "restatement",
    "text": "Original: 'The report suggests that climate change is accelerating faster than previously predicted.'",
    "options": [
      "The report confirms that climate change predictions have been accurate all along.",
      "The report questions whether climate change predictions have been reliable.",
      "According to the report, climate change is happening at a more rapid pace than earlier forecasts indicated.",
      "The report indicates that climate change is occurring, but at a slower rate than expected."
    ],
    "correctAnswer": 2,
    "explanation": "This option preserves the key claim that climate change is proceeding at a rate exceeding prior predictions, maintaining the comparative element and the tentative nature of the finding.",
    "difficulty": "medium",
    "id": 3751
  },
  {
    "type": "restatement",
    "text": "Original: 'Many experts believe artificial intelligence will transform the job market within a decade.'",
    "options": [
      "Artificial intelligence has already transformed the job market according to most experts.",
      "All experts agree that artificial intelligence will eliminate jobs in the next ten years.",
      "Some specialists think artificial intelligence might impact employment in the future.",
      "A significant number of specialists predict that AI will substantially change employment patterns in the next ten years."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the quantifier 'many' (not all) experts, preserves the future timeframe of a decade, and keeps the transformative impact on employment, without exaggerating the claim.",
    "difficulty": "medium",
    "id": 3752
  },
  {
    "type": "restatement",
    "text": "Original: 'Although they had never met before, they talked as if they were old friends.'",
    "options": [
      "They became good friends after their first conversation.",
      "Despite being strangers, they conversed with the familiarity of long-time acquaintances.",
      "They spoke formally because they were meeting for the first time.",
      "They pretended to be friends even though they disliked each other."
    ],
    "correctAnswer": 1,
    "explanation": "This option preserves the contrast between their status as strangers and the surprising intimacy of their interaction, maintaining the simile comparing their conversation to that of old friends.",
    "difficulty": "medium",
    "id": 3753
  },
  {
    "type": "restatement",
    "text": "Original: 'Having finished all her work, Sarah decided to take a well-deserved vacation.'",
    "options": [
      "Sarah's vacation was interrupted because she had to finish her work.",
      "Sarah was considering a vacation after her work was halfway done.",
      "Sarah completed her tasks and then chose to go on vacation as a reward.",
      "Sarah went on vacation before finishing her work."
    ],
    "correctAnswer": 2,
    "explanation": "This option maintains the sequence of events (work completion followed by vacation) and the notion that the vacation was earned through completing her tasks.",
    "difficulty": "medium",
    "id": 3756
  },
  {
    "type": "restatement",
    "text": "Original: 'The company is not only expanding its operations domestically but also opening new branches overseas.'",
    "options": [
      "The company is focusing exclusively on international expansion.",
      "The company has decided against domestic expansion in favor of international growth.",
      "The company is growing both within the country and internationally.",
      "The company is considering whether to expand domestically or internationally."
    ],
    "correctAnswer": 2,
    "explanation": "This option correctly captures the dual nature of the expansion occurring simultaneously both domestically and internationally, preserving the 'not only...but also' structure's meaning.",
    "difficulty": "medium",
    "id": 3757
  },
  {
    "type": "restatement",
    "text": "Original: 'Although he had prepared thoroughly, John was still nervous about the presentation.'",
    "options": [
      "John's thorough preparation eliminated his nervousness about the presentation.",
      "John felt anxious about presenting despite his comprehensive preparation.",
      "John wasn't prepared enough, which made him nervous about the presentation.",
      "John prepared thoroughly because he was nervous about the presentation."
    ],
    "correctAnswer": 1,
    "explanation": "This option maintains the contrast between John's thorough preparation and his persistent nervousness, preserving the concessive relationship indicated by 'although.'",
    "difficulty": "medium",
    "id": 3758
  },
  {
    "type": "restatement",
    "text": "Original: 'The documentary shed light on issues that had previously been ignored by mainstream media.'",
    "options": [
      "Mainstream media covered the same issues as the documentary but in less detail.",
      "The documentary addressed topics that mainstream media had failed to cover.",
      "Mainstream media commissioned the documentary to address overlooked issues.",
      "The documentary criticized mainstream media for biased reporting."
    ],
    "correctAnswer": 1,
    "explanation": "This option captures the key idea that the documentary revealed or exposed ('shed light on') topics that mainstream media had neglected or overlooked.",
    "difficulty": "medium",
    "id": 3759
  },
  {
    "type": "restatement",
    "text": "Original: 'The company postponed the meeting until all stakeholders could attend.'",
    "options": [
      "The company delayed the meeting to ensure all stakeholders could be present.",
      "The meeting was canceled because some stakeholders couldn't make it.",
      "The meeting proceeded despite some stakeholders being absent.",
      "All stakeholders demanded that the company reschedule the meeting."
    ],
    "correctAnswer": 0,
    "explanation": "This option preserves the core meaning that the meeting was delayed specifically to accommodate all stakeholders' attendance, without adding new information or changing the reason.",
    "difficulty": "medium",
    "id": 3762
  },
  {
    "type": "restatement",
    "text": "Original: 'Although he studied diligently, he failed to pass the examination.'",
    "options": [
      "He passed the examination because of his diligent studying.",
      "The examination was too difficult despite everyone's preparation.",
      "He didn't study enough, which is why he failed the examination.",
      "His diligent studying wasn't enough for him to pass the examination."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains the contrast between the effort (diligent studying) and the unexpected negative outcome (failing), preserving the original contradiction without altering the facts.",
    "difficulty": "medium",
    "id": 3763
  },
  {
    "type": "restatement",
    "text": "Original: 'The critics praised the film for its innovative cinematography but criticized its weak plot.'",
    "options": [
      "The film's cinematography was considered groundbreaking, though its storyline was deemed inadequate.",
      "Both the cinematography and plot of the film were heavily criticized by reviewers.",
      "Despite its poor cinematography, the film was lauded for its compelling storyline.",
      "The film received mixed reviews, with some loving the plot and others appreciating the camera work."
    ],
    "correctAnswer": 0,
    "explanation": "This option accurately captures both aspects of the original statement: the positive assessment of the cinematography as innovative and the negative assessment of the plot as weak.",
    "difficulty": "medium",
    "id": 3764
  },
  {
    "type": "restatement",
    "text": "Original: 'Sarah reluctantly agreed to take on the project, despite her heavy workload.'",
    "options": [
      "Sarah declined the project because she was already too busy with other work.",
      "Sarah's workload was lightened so she could focus on the new project.",
      "Sarah enthusiastically volunteered for the project to add to her workload.",
      "Despite being busy with other work, Sarah accepted the project without enthusiasm."
    ],
    "correctAnswer": 3,
    "explanation": "This option maintains both key elements: Sarah's hesitation ('reluctantly') and the fact that she accepted the project even though she already had many responsibilities.",
    "difficulty": "medium",
    "id": 3765
  }
];

module.exports = questions;
