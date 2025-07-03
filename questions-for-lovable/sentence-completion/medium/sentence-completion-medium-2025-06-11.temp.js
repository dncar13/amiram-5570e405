const questions = [
  {
    "type": "sentence-completion",
    "text": "Despite the heavy rain, she ____ to work on time.",
    "options": [
      "managing",
      "manage",
      "manages",
      "managed"
    ],
    "correctAnswer": 3,
    "explanation": "Past simple 'managed' is correct because the sentence describes a completed action in the past, indicated by the context.",
    "difficulty": "medium",
    "id": 2662
  },
  {
    "type": "sentence-completion",
    "text": "If you had studied harder, you ____ the exam.",
    "options": [
      "had passed",
      "would have passed",
      "will pass",
      "would pass"
    ],
    "correctAnswer": 1,
    "explanation": "This is a third conditional sentence expressing an unreal past situation. 'Would have passed' correctly follows 'If you had studied' to complete this structure.",
    "difficulty": "medium",
    "id": 2663
  },
  {
    "type": "sentence-completion",
    "text": "She's been working on this project ____ three months now.",
    "options": [
      "during",
      "for",
      "since",
      "while"
    ],
    "correctAnswer": 1,
    "explanation": "With time periods (three months), we use 'for' to indicate duration. 'Since' would be used with a specific point in time.",
    "difficulty": "medium",
    "id": 2664
  },
  {
    "type": "sentence-completion",
    "text": "The documentary ____ fascinating insights into marine life.",
    "options": [
      "provide",
      "provides",
      "provided",
      "providing"
    ],
    "correctAnswer": 1,
    "explanation": "Present simple 'provides' agrees with the singular subject 'documentary' and indicates a general truth about what the documentary does.",
    "difficulty": "medium",
    "id": 2665
  },
  {
    "type": "sentence-completion",
    "text": "I'd rather you ____ tell anyone about what happened yesterday.",
    "options": [
      "don't",
      "didn't",
      "won't",
      "wouldn't"
    ],
    "correctAnswer": 1,
    "explanation": "After 'I'd rather you' (expressing preference about others), we use the past simple form 'didn't' even though referring to present or future actions.",
    "difficulty": "medium",
    "id": 2666
  },
  {
    "type": "sentence-completion",
    "text": "The concert was so popular that tickets were sold ____ within hours.",
    "options": [
      "through",
      "away",
      "off",
      "out"
    ],
    "correctAnswer": 3,
    "explanation": "The phrasal verb 'sold out' means all tickets were purchased. This is the correct idiomatic expression for this context.",
    "difficulty": "medium",
    "id": 2667
  },
  {
    "type": "sentence-completion",
    "text": "By the time we arrived at the theater, the movie ____ started.",
    "options": [
      "has already",
      "had already",
      "was already",
      "already"
    ],
    "correctAnswer": 1,
    "explanation": "Past perfect 'had already' is needed because we're describing an action completed before another past action (our arrival at the theater).",
    "difficulty": "medium",
    "id": 2668
  },
  {
    "type": "sentence-completion",
    "text": "The government announced a series of measures ____ to reduce pollution.",
    "options": [
      "aim",
      "aimed",
      "aims",
      "aiming"
    ],
    "correctAnswer": 3,
    "explanation": "The present participle 'aiming' forms a reduced relative clause modifying 'measures' (measures that aim to reduce pollution).",
    "difficulty": "medium",
    "id": 2669
  },
  {
    "type": "sentence-completion",
    "text": "You should ____ advantage of the opportunity to study abroad.",
    "options": [
      "take",
      "make",
      "have",
      "do"
    ],
    "correctAnswer": 0,
    "explanation": "The fixed collocation is 'take advantage of' - this is an idiomatic expression meaning to use an opportunity beneficially.",
    "difficulty": "medium",
    "id": 2670
  },
  {
    "type": "sentence-completion",
    "text": "I wish I ____ how to swim when I was younger.",
    "options": [
      "would learn",
      "have learned",
      "learned",
      "had learned"
    ],
    "correctAnswer": 3,
    "explanation": "After 'wish' referring to past regrets, we use past perfect 'had learned' to express something that didn't happen but the speaker wanted it to.",
    "difficulty": "medium",
    "id": 2671
  },
  {
    "type": "sentence-completion",
    "text": "The movie was so boring that I could barely keep myself ____.",
    "options": [
      "awoke",
      "awake",
      "awakened",
      "awaking"
    ],
    "correctAnswer": 1,
    "explanation": "The adjective 'awake' correctly completes this expression. The other options are verb forms that don't fit grammatically after 'keep myself'.",
    "difficulty": "medium",
    "id": 2674
  },
  {
    "type": "sentence-completion",
    "text": "She hasn't ____ her mind about attending the conference next week.",
    "options": [
      "made off",
      "made up",
      "made out",
      "made over"
    ],
    "correctAnswer": 1,
    "explanation": "The phrasal verb 'make up one's mind' means to decide or determine. The other phrasal verbs have different meanings that don't fit this context.",
    "difficulty": "medium",
    "id": 2675
  },
  {
    "type": "sentence-completion",
    "text": "The company is looking for candidates who can work ____ and solve problems efficiently.",
    "options": [
      "depend",
      "independent",
      "independence",
      "independently"
    ],
    "correctAnswer": 3,
    "explanation": "An adverb is needed to modify the verb 'work'. 'Independently' correctly describes how the candidates should work, while the other options are nouns or adjectives.",
    "difficulty": "medium",
    "id": 2676
  },
  {
    "type": "sentence-completion",
    "text": "The government has implemented several measures ____ reduce pollution in urban areas.",
    "options": [
      "by",
      "to",
      "in",
      "for"
    ],
    "correctAnswer": 1,
    "explanation": "The infinitive marker 'to' is needed here to express purpose. The sentence structure requires 'to + verb' to indicate why the measures were implemented.",
    "difficulty": "medium",
    "id": 2677
  },
  {
    "type": "sentence-completion",
    "text": "The documentary ____ light on many previously unknown aspects of marine life.",
    "options": [
      "sheds",
      "throws",
      "casts",
      "all of the above"
    ],
    "correctAnswer": 3,
    "explanation": "All three verbs (shed, throw, cast) can collocate with 'light on' to mean revealing or clarifying something previously unknown or unclear.",
    "difficulty": "medium",
    "id": 2679
  },
  {
    "type": "sentence-completion",
    "text": "By the time we arrived at the theater, the movie ____ for 20 minutes.",
    "options": [
      "had been running",
      "was running",
      "runs",
      "has been running"
    ],
    "correctAnswer": 0,
    "explanation": "Past perfect continuous ('had been running') is used to describe an action that began before a specific point in the past and continued up to that point.",
    "difficulty": "medium",
    "id": 2680
  },
  {
    "type": "sentence-completion",
    "text": "The new policy is ____ to increase productivity while reducing overtime hours.",
    "options": [
      "extended",
      "contended",
      "intended",
      "pretended"
    ],
    "correctAnswer": 2,
    "explanation": "The verb 'intended' means designed or planned for a particular purpose, which fits the context. The other options have meanings that don't logically fit here.",
    "difficulty": "medium",
    "id": 2681
  },
  {
    "type": "sentence-completion",
    "text": "If you ____ harder, you would have passed the exam.",
    "options": [
      "study",
      "had studied",
      "studied",
      "studies"
    ],
    "correctAnswer": 1,
    "explanation": "The past perfect 'had studied' is needed in this third conditional sentence to express an unreal past situation and its hypothetical result.",
    "difficulty": "medium",
    "id": 2683
  },
  {
    "type": "sentence-completion",
    "text": "The documentary about climate change was both informative and ____.",
    "options": [
      "bore",
      "bored",
      "bores",
      "boring"
    ],
    "correctAnswer": 3,
    "explanation": "The adjective 'boring' describes the documentary itself. We need an adjective ending in '-ing' to describe something that causes a feeling.",
    "difficulty": "medium",
    "id": 2684
  },
  {
    "type": "sentence-completion",
    "text": "She hasn't ____ the decision yet, but she's considering all options.",
    "options": [
      "made",
      "making",
      "makes",
      "make"
    ],
    "correctAnswer": 0,
    "explanation": "With present perfect 'hasn't', we need the past participle form 'made' to complete the verb phrase and indicate an action not yet completed.",
    "difficulty": "medium",
    "id": 2685
  },
  {
    "type": "sentence-completion",
    "text": "The company is looking for candidates who have ____ experience in marketing.",
    "options": [
      "many",
      "plenty",
      "extensive",
      "much"
    ],
    "correctAnswer": 2,
    "explanation": "'Extensive' is the appropriate adjective to describe significant experience. 'Much' and 'many' are quantifiers, while 'plenty' typically requires 'of' afterward.",
    "difficulty": "medium",
    "id": 2686
  },
  {
    "type": "sentence-completion",
    "text": "The concert was ____ postponed due to the severe weather conditions.",
    "options": [
      "suddenly",
      "eventual",
      "reluctantly",
      "lately"
    ],
    "correctAnswer": 0,
    "explanation": "The adverb 'suddenly' correctly modifies how the concert was postponed, suggesting it happened without warning. The other options don't fit logically or grammatically.",
    "difficulty": "medium",
    "id": 2688
  },
  {
    "type": "sentence-completion",
    "text": "By the time we arrived at the theater, the movie ____ for twenty minutes.",
    "options": [
      "played",
      "had been playing",
      "has been playing",
      "was playing"
    ],
    "correctAnswer": 1,
    "explanation": "Past perfect continuous 'had been playing' is needed to express an action that started before a specific point in the past and continued up to that point.",
    "difficulty": "medium",
    "id": 2689
  },
  {
    "type": "sentence-completion",
    "text": "The professor asked us to submit our assignments ____ the end of the week.",
    "options": [
      "at",
      "until",
      "since",
      "by"
    ],
    "correctAnswer": 3,
    "explanation": "The preposition 'by' indicates a deadline. It means no later than a specific time, while the other options don't correctly express this deadline relationship.",
    "difficulty": "medium",
    "id": 2690
  },
  {
    "type": "sentence-completion",
    "text": "The new policy has ____ significant changes in how the company operates.",
    "options": [
      "brought about",
      "put away",
      "taken after",
      "come across"
    ],
    "correctAnswer": 0,
    "explanation": "The phrasal verb 'brought about' means 'caused to happen' and correctly collocates with 'changes'. The other phrasal verbs have different meanings that don't fit this context.",
    "difficulty": "medium",
    "id": 2691
  },
  {
    "type": "sentence-completion",
    "text": "If you ____ harder, you might have passed the exam.",
    "options": [
      "had studied",
      "studied",
      "would study",
      "study"
    ],
    "correctAnswer": 0,
    "explanation": "The past perfect 'had studied' is needed in this third conditional sentence to express a hypothetical past situation with a different outcome.",
    "difficulty": "medium",
    "id": 2693
  },
  {
    "type": "sentence-completion",
    "text": "The company has been ____ negotiations with potential investors for several months.",
    "options": [
      "conduct",
      "conducted",
      "conducts",
      "conducting"
    ],
    "correctAnswer": 3,
    "explanation": "The present participle 'conducting' is needed after 'has been' to form the present perfect continuous tense, showing an ongoing action.",
    "difficulty": "medium",
    "id": 2694
  },
  {
    "type": "sentence-completion",
    "text": "I'd rather you ____ tell anyone about the surprise party.",
    "options": [
      "won't",
      "wouldn't",
      "don't",
      "didn't"
    ],
    "correctAnswer": 3,
    "explanation": "After 'I'd rather you', we use the past simple 'didn't' even when referring to present or future actions, as this is a subjunctive form.",
    "difficulty": "medium",
    "id": 2695
  },
  {
    "type": "sentence-completion",
    "text": "The documentary ____ light on many previously unknown facts about marine life.",
    "options": [
      "gives",
      "puts",
      "sheds",
      "makes"
    ],
    "correctAnswer": 2,
    "explanation": "The correct collocation is 'shed light on', which means to clarify or reveal information about something previously unknown or unclear.",
    "difficulty": "medium",
    "id": 2696
  },
  {
    "type": "sentence-completion",
    "text": "By the time we arrive, the movie ____ for half an hour.",
    "options": [
      "is starting",
      "will have started",
      "starts",
      "will start"
    ],
    "correctAnswer": 1,
    "explanation": "Future perfect 'will have started' is needed to indicate an action that will be completed before another future action (our arrival).",
    "difficulty": "medium",
    "id": 2697
  },
  {
    "type": "sentence-completion",
    "text": "The police officer asked me where I ____ going in such a hurry.",
    "options": [
      "was",
      "am",
      "had been",
      "were"
    ],
    "correctAnswer": 0,
    "explanation": "In reported speech following a past tense verb ('asked'), the present tense 'am' changes to past tense 'was' to maintain the sequence of tenses.",
    "difficulty": "medium",
    "id": 2698
  },
  {
    "type": "sentence-completion",
    "text": "The project was delayed ____ unforeseen technical difficulties.",
    "options": [
      "because",
      "since",
      "due to",
      "as"
    ],
    "correctAnswer": 2,
    "explanation": "The preposition phrase 'due to' is appropriate here to introduce the reason for the delay, especially in formal contexts like project management.",
    "difficulty": "medium",
    "id": 2699
  },
  {
    "type": "sentence-completion",
    "text": "I can't ____ how anyone could believe such an obvious lie.",
    "options": [
      "figure in",
      "figure out",
      "figure up",
      "figure on"
    ],
    "correctAnswer": 1,
    "explanation": "The phrasal verb 'figure out' means to understand or solve something puzzling, making it the only logical choice in this context.",
    "difficulty": "medium",
    "id": 2700
  },
  {
    "type": "sentence-completion",
    "text": "The new regulations ____ effect at the beginning of next month.",
    "options": [
      "have",
      "take",
      "make",
      "do"
    ],
    "correctAnswer": 1,
    "explanation": "The fixed expression 'take effect' is used to describe when laws, rules, or regulations become active or enforceable.",
    "difficulty": "medium",
    "id": 2701
  },
  {
    "type": "sentence-completion",
    "text": "If you had told me earlier, I ____ able to help you.",
    "options": [
      "would have been",
      "will be",
      "would be",
      "am"
    ],
    "correctAnswer": 0,
    "explanation": "The third conditional requires 'would have been' to express a hypothetical past situation that didn't happen and its imagined result.",
    "difficulty": "medium",
    "id": 2703
  },
  {
    "type": "sentence-completion",
    "text": "He's been working on that project ____ three months now.",
    "options": [
      "for",
      "since",
      "while",
      "during"
    ],
    "correctAnswer": 0,
    "explanation": "We use 'for' with periods of time to indicate duration. 'Since' would be used with a specific point in time instead.",
    "difficulty": "medium",
    "id": 2705
  },
  {
    "type": "sentence-completion",
    "text": "The movie was so boring that I could hardly ____ myself awake.",
    "options": [
      "keep",
      "remain",
      "stay",
      "hold"
    ],
    "correctAnswer": 0,
    "explanation": "The collocation 'keep oneself awake' is the correct idiomatic expression here, referring to the effort to not fall asleep.",
    "difficulty": "medium",
    "id": 2707
  },
  {
    "type": "sentence-completion",
    "text": "She ____ have left already; her car isn't in the parking lot.",
    "options": [
      "might",
      "can",
      "will",
      "should"
    ],
    "correctAnswer": 0,
    "explanation": "The modal verb 'might' expresses possibility based on the evidence (missing car), showing uncertainty about a past action.",
    "difficulty": "medium",
    "id": 2708
  },
  {
    "type": "sentence-completion",
    "text": "The government has introduced several measures ____ unemployment.",
    "options": [
      "for reducing",
      "to reduce",
      "reducing",
      "reduced"
    ],
    "correctAnswer": 1,
    "explanation": "The infinitive 'to reduce' correctly expresses purpose - the measures were introduced with the aim of reducing unemployment.",
    "difficulty": "medium",
    "id": 2709
  },
  {
    "type": "sentence-completion",
    "text": "The company is looking for candidates who ____ experience in digital marketing.",
    "options": [
      "are having",
      "have",
      "has",
      "had"
    ],
    "correctAnswer": 1,
    "explanation": "Present simple 'have' is correct because we're describing a permanent quality or characteristic that the candidates possess.",
    "difficulty": "medium",
    "id": 2711
  },
  {
    "type": "sentence-completion",
    "text": "The company has been ____ new employees since January.",
    "options": [
      "hires",
      "hire",
      "hired",
      "hiring"
    ],
    "correctAnswer": 3,
    "explanation": "The present perfect continuous requires the -ing form 'hiring' to express an ongoing action that started in the past and continues to the present.",
    "difficulty": "medium",
    "id": 2715
  },
  {
    "type": "sentence-completion",
    "text": "She's not used to ____ in such a large city.",
    "options": [
      "lives",
      "lived",
      "living",
      "live"
    ],
    "correctAnswer": 2,
    "explanation": "After 'used to' meaning 'accustomed to', we need the gerund form 'living'. This is different from 'used to + infinitive' which describes past habits.",
    "difficulty": "medium",
    "id": 2716
  },
  {
    "type": "sentence-completion",
    "text": "The committee ____ divided on whether to approve the new policy.",
    "options": [
      "is",
      "was",
      "are",
      "were"
    ],
    "correctAnswer": 2,
    "explanation": "In British English, collective nouns like 'committee' take plural verbs ('are') when emphasizing the individual members acting separately or with different opinions.",
    "difficulty": "medium",
    "id": 2719
  },
  {
    "type": "sentence-completion",
    "text": "It's high time we ____ a decision about this matter.",
    "options": [
      "making",
      "make",
      "made",
      "makes"
    ],
    "correctAnswer": 2,
    "explanation": "After the expression 'it's high time', we use the past simple 'made' even though we're talking about present or future actions to emphasize urgency.",
    "difficulty": "medium",
    "id": 2720
  },
  {
    "type": "sentence-completion",
    "text": "The research findings ____ that regular exercise improves mental health.",
    "options": [
      "suggest",
      "suggests",
      "suggesting",
      "suggested"
    ],
    "correctAnswer": 1,
    "explanation": "The singular subject 'research findings' requires the singular verb form 'suggests' to maintain subject-verb agreement in the present simple tense.",
    "difficulty": "medium",
    "id": 2721
  },
  {
    "type": "sentence-completion",
    "text": "She spoke so quietly that I could ____ hear what she was saying.",
    "options": [
      "deeply",
      "hardly",
      "nearly",
      "closely"
    ],
    "correctAnswer": 1,
    "explanation": "'Hardly' means 'almost not at all' and correctly expresses difficulty hearing someone speaking quietly. The other adverbs don't convey this meaning.",
    "difficulty": "medium",
    "id": 2727
  },
  {
    "type": "sentence-completion",
    "text": "The new policy ____ effect from the beginning of next month.",
    "options": [
      "taking",
      "took",
      "will take",
      "takes"
    ],
    "correctAnswer": 2,
    "explanation": "Future simple 'will take' is correct because the sentence refers to something scheduled to happen at a specific time in the future.",
    "difficulty": "medium",
    "id": 2729
  },
  {
    "type": "sentence-completion",
    "text": "The children were so excited that they ____ sit still during the performance.",
    "options": [
      "wouldn't",
      "couldn't",
      "can't",
      "won't"
    ],
    "correctAnswer": 1,
    "explanation": "Past simple modal 'couldn't' matches the past tense context ('were') and expresses inability in the past. 'Can't' would be present tense.",
    "difficulty": "medium",
    "id": 2731
  },
  {
    "type": "sentence-completion",
    "text": "The company has ____ several new employees to help with the increased workload.",
    "options": [
      "hiring",
      "hires",
      "hire",
      "hired"
    ],
    "correctAnswer": 3,
    "explanation": "Present perfect 'hired' is needed after 'has' to form the correct tense, showing an action completed recently with present relevance.",
    "difficulty": "medium",
    "id": 2733
  },
  {
    "type": "sentence-completion",
    "text": "If I ____ more time, I would visit my grandparents more often.",
    "options": [
      "having",
      "had",
      "have",
      "has"
    ],
    "correctAnswer": 1,
    "explanation": "Past simple 'had' is used in the if-clause of a second conditional sentence to express an unreal or hypothetical present situation.",
    "difficulty": "medium",
    "id": 2734
  },
  {
    "type": "sentence-completion",
    "text": "She speaks English ____ than her brother, even though they attended the same school.",
    "options": [
      "well",
      "good",
      "best",
      "better"
    ],
    "correctAnswer": 3,
    "explanation": "The comparative form 'better' is needed because the sentence compares the speaking abilities of two people (she and her brother).",
    "difficulty": "medium",
    "id": 2735
  },
  {
    "type": "sentence-completion",
    "text": "The children were ____ tired after the long journey that they fell asleep immediately.",
    "options": [
      "such",
      "too",
      "so",
      "very"
    ],
    "correctAnswer": 2,
    "explanation": "'So' is the correct intensifier before an adjective ('tired') when followed by 'that' to express a result or consequence.",
    "difficulty": "medium",
    "id": 2736
  },
  {
    "type": "sentence-completion",
    "text": "By this time next year, I ____ in this company for a decade.",
    "options": [
      "work",
      "will have worked",
      "will work",
      "will be working"
    ],
    "correctAnswer": 1,
    "explanation": "Future perfect 'will have worked' expresses an action that will be completed before a specific point in the future ('by this time next year').",
    "difficulty": "medium",
    "id": 2737
  },
  {
    "type": "sentence-completion",
    "text": "The movie was ____ boring that several people left the theater before it ended.",
    "options": [
      "such",
      "enough",
      "so",
      "too"
    ],
    "correctAnswer": 2,
    "explanation": "'So' is used before an adjective ('boring') followed by 'that' to indicate cause and effect or result.",
    "difficulty": "medium",
    "id": 2738
  },
  {
    "type": "sentence-completion",
    "text": "The professor asked the students to submit their assignments ____ Friday.",
    "options": [
      "until",
      "at",
      "by",
      "in"
    ],
    "correctAnswer": 2,
    "explanation": "The preposition 'by' indicates a deadline, meaning the assignments must be submitted on or before Friday, not after.",
    "difficulty": "medium",
    "id": 2740
  },
  {
    "type": "sentence-completion",
    "text": "You ____ have seen John at the party; he was in another country that weekend.",
    "options": [
      "wouldn't",
      "can't",
      "shouldn't",
      "mustn't"
    ],
    "correctAnswer": 1,
    "explanation": "'Can't' expresses logical impossibility based on known facts. It's impossible that you saw John because he was elsewhere.",
    "difficulty": "medium",
    "id": 2741
  },
  {
    "type": "sentence-completion",
    "text": "She ____ in this company since 2010.",
    "options": [
      "is working",
      "works",
      "worked",
      "has worked"
    ],
    "correctAnswer": 3,
    "explanation": "Present perfect 'has worked' is needed to express an action that started in the past (2010) and continues to the present.",
    "difficulty": "medium",
    "id": 2744
  },
  {
    "type": "sentence-completion",
    "text": "The movie was so boring that I fell ____ halfway through.",
    "options": [
      "sleep",
      "sleepy",
      "sleeping",
      "asleep"
    ],
    "correctAnswer": 3,
    "explanation": "'Fall asleep' is the correct phrasal verb meaning to begin sleeping. 'Fall sleep' is incorrect, and 'fall sleeping/sleepy' are not standard expressions.",
    "difficulty": "medium",
    "id": 2745
  },
  {
    "type": "sentence-completion",
    "text": "By the time we arrived at the theater, the play had already ____.",
    "options": [
      "began",
      "begun",
      "begin",
      "beginning"
    ],
    "correctAnswer": 1,
    "explanation": "Past perfect 'had begun' requires the past participle form 'begun', not the base form or past simple, to indicate an action completed before another past action.",
    "difficulty": "medium",
    "id": 2746
  },
  {
    "type": "sentence-completion",
    "text": "The government needs to ____ more resources to education.",
    "options": [
      "assign",
      "dedicate",
      "distribute",
      "allocate"
    ],
    "correctAnswer": 3,
    "explanation": "While all options are somewhat similar, 'allocate resources' is the most natural collocation when referring to official distribution of funds or materials.",
    "difficulty": "medium",
    "id": 2747
  },
  {
    "type": "sentence-completion",
    "text": "The concert was ____ by thousands of enthusiastic fans.",
    "options": [
      "participated",
      "visited",
      "joined",
      "attended"
    ],
    "correctAnswer": 3,
    "explanation": "The verb 'attend' collocates with events like concerts, while the other options don't correctly express the relationship between fans and a concert.",
    "difficulty": "medium",
    "id": 2749
  },
  {
    "type": "sentence-completion",
    "text": "She's not only intelligent ____ also very hardworking.",
    "options": [
      "as",
      "but",
      "so",
      "and"
    ],
    "correctAnswer": 1,
    "explanation": "The correlative conjunction pair 'not only... but also' is the correct structure to link two positive qualities. Other options don't complete this grammatical pattern.",
    "difficulty": "medium",
    "id": 2750
  },
  {
    "type": "sentence-completion",
    "text": "The professor asked us to ____ our assignments by Friday.",
    "options": [
      "hand in",
      "hand over",
      "hand out",
      "hand down"
    ],
    "correctAnswer": 0,
    "explanation": "The phrasal verb 'hand in' specifically means to submit work to a teacher or authority. 'Hand out' means distribute, 'hand over' means surrender, and 'hand down' means pass to younger generations.",
    "difficulty": "medium",
    "id": 2751
  },
  {
    "type": "sentence-completion",
    "text": "If I ____ more time, I would visit my grandmother more often.",
    "options": [
      "had",
      "has",
      "having",
      "have"
    ],
    "correctAnswer": 0,
    "explanation": "In conditional sentences expressing hypothetical situations, we use the past tense 'had' in the if-clause, even though we're talking about present time.",
    "difficulty": "medium",
    "id": 2753
  },
  {
    "type": "sentence-completion",
    "text": "She hasn't ____ up her mind about which university to attend yet.",
    "options": [
      "take",
      "making",
      "made",
      "took"
    ],
    "correctAnswer": 2,
    "explanation": "The fixed expression is 'make up one's mind,' meaning to decide. Other verbs like 'take' don't collocate with 'up one's mind' in English.",
    "difficulty": "medium",
    "id": 2754
  },
  {
    "type": "sentence-completion",
    "text": "The movie was so boring that I could barely ____ myself awake.",
    "options": [
      "keep",
      "hold",
      "remain",
      "stay"
    ],
    "correctAnswer": 0,
    "explanation": "The collocation 'keep oneself awake' is correct here. While 'stay awake' exists, the reflexive structure requires 'keep' as the most natural verb choice.",
    "difficulty": "medium",
    "id": 2755
  },
  {
    "type": "sentence-completion",
    "text": "The concert ____ place at the new stadium next Saturday.",
    "options": [
      "takes",
      "has",
      "makes",
      "gives"
    ],
    "correctAnswer": 0,
    "explanation": "The fixed expression 'take place' means to occur or happen. This is a common collocation when talking about events being held at specific times and locations.",
    "difficulty": "medium",
    "id": 2756
  },
  {
    "type": "sentence-completion",
    "text": "You should ____ advantage of the good weather and go for a hike.",
    "options": [
      "have",
      "make",
      "take",
      "do"
    ],
    "correctAnswer": 2,
    "explanation": "The fixed expression is 'take advantage of,' meaning to use an opportunity beneficially. This is a common collocation that cannot be substituted with other verbs.",
    "difficulty": "medium",
    "id": 2758
  },
  {
    "type": "sentence-completion",
    "text": "By the time we arrived at the theater, the movie ____ already started.",
    "options": [
      "would have",
      "had",
      "has",
      "was"
    ],
    "correctAnswer": 1,
    "explanation": "Past perfect 'had started' is needed because it describes an action completed before another past action (our arrival). This shows the sequence of events clearly.",
    "difficulty": "medium",
    "id": 2759
  },
  {
    "type": "sentence-completion",
    "text": "The government is ____ measures to reduce air pollution in the city.",
    "options": [
      "implementing",
      "imposing",
      "implanting",
      "impeding"
    ],
    "correctAnswer": 0,
    "explanation": "To 'implement measures' means to put plans into action. While 'impose' can sometimes work with 'measures,' 'implementing' is more appropriate for positive policy actions.",
    "difficulty": "medium",
    "id": 2760
  },
  {
    "type": "sentence-completion",
    "text": "She speaks not only English but ____ French and Spanish.",
    "options": [
      "neither",
      "too",
      "also",
      "either"
    ],
    "correctAnswer": 2,
    "explanation": "The correlative conjunction pair 'not only... but also' is used to emphasize multiple items. 'Also' completes this structure correctly to link the languages she speaks.",
    "difficulty": "medium",
    "id": 2761
  },
  {
    "type": "sentence-completion",
    "text": "She hasn't ____ up her mind about which university to attend.",
    "options": [
      "took",
      "take",
      "taking",
      "made"
    ],
    "correctAnswer": 3,
    "explanation": "The correct collocation is 'make up one's mind,' meaning to decide. This is a fixed expression where 'make' is the appropriate verb.",
    "difficulty": "medium",
    "id": 2764
  },
  {
    "type": "sentence-completion",
    "text": "The concert was ____ crowded that we couldn't find seats.",
    "options": [
      "such",
      "so",
      "too",
      "very"
    ],
    "correctAnswer": 1,
    "explanation": "We use 'so' before an adjective (crowded) to express intensity. 'Such' would be used before a noun or adjective+noun combination.",
    "difficulty": "medium",
    "id": 2765
  },
  {
    "type": "sentence-completion",
    "text": "By the time we arrived, the movie had already ____.",
    "options": [
      "begin",
      "beginning",
      "begun",
      "begins"
    ],
    "correctAnswer": 2,
    "explanation": "Past perfect tense ('had already begun') requires the past participle form of the verb, which is 'begun' for the irregular verb 'begin'.",
    "difficulty": "medium",
    "id": 2766
  },
  {
    "type": "sentence-completion",
    "text": "The company is looking for candidates ____ have experience in digital marketing.",
    "options": [
      "who",
      "whose",
      "which",
      "whom"
    ],
    "correctAnswer": 0,
    "explanation": "The relative pronoun 'who' is correct because it refers to people (candidates) and functions as the subject of the relative clause.",
    "difficulty": "medium",
    "id": 2768
  },
  {
    "type": "sentence-completion",
    "text": "You should ____ advantage of the discount before the sale ends.",
    "options": [
      "take",
      "have",
      "do",
      "make"
    ],
    "correctAnswer": 0,
    "explanation": "The fixed expression is 'take advantage of,' meaning to use an opportunity for benefit. This is a common collocation where only 'take' works.",
    "difficulty": "medium",
    "id": 2769
  },
  {
    "type": "sentence-completion",
    "text": "The children were excited ____ the news about the school trip.",
    "options": [
      "for",
      "with",
      "by",
      "about"
    ],
    "correctAnswer": 3,
    "explanation": "The correct preposition after 'excited' when referring to news or information is 'about'. This is a fixed collocation in English.",
    "difficulty": "medium",
    "id": 2770
  },
  {
    "type": "sentence-completion",
    "text": "The professor asked the students to ____ their assignments by Friday.",
    "options": [
      "submit",
      "submits",
      "submitting",
      "submitted"
    ],
    "correctAnswer": 0,
    "explanation": "After 'to' in this context, we need the base form of the verb (infinitive without 'to'). 'Submit' is the correct infinitive form.",
    "difficulty": "medium",
    "id": 2773
  },
  {
    "type": "sentence-completion",
    "text": "If I ____ more time, I would travel around the world.",
    "options": [
      "had",
      "has",
      "have",
      "having"
    ],
    "correctAnswer": 0,
    "explanation": "This is a second conditional sentence expressing an unreal present situation. The past simple 'had' is used in the if-clause of this conditional structure.",
    "difficulty": "medium",
    "id": 2774
  },
  {
    "type": "sentence-completion",
    "text": "The documentary ____ interesting insights into marine life.",
    "options": [
      "provide",
      "provided",
      "provides",
      "providing"
    ],
    "correctAnswer": 2,
    "explanation": "Present simple 'provides' is correct because we're describing a general characteristic of the documentary, and the subject 'documentary' is singular, requiring the -s ending.",
    "difficulty": "medium",
    "id": 2776
  },
  {
    "type": "sentence-completion",
    "text": "I wish I ____ how to speak Japanese before visiting Tokyo last year.",
    "options": [
      "knew",
      "had known",
      "knowing",
      "know"
    ],
    "correctAnswer": 1,
    "explanation": "After 'wish' referring to a past regret, we use past perfect 'had known'. This expresses something you wish had happened differently in the past.",
    "difficulty": "medium",
    "id": 2778
  },
  {
    "type": "sentence-completion",
    "text": "You ____ have told me about the change in plans earlier.",
    "options": [
      "might",
      "could",
      "would",
      "should"
    ],
    "correctAnswer": 3,
    "explanation": "'Should have' expresses criticism about a past action that didn't happen. It suggests the person had an obligation or it would have been better to tell earlier.",
    "difficulty": "medium",
    "id": 2781
  },
  {
    "type": "sentence-completion",
    "text": "She hasn't been feeling well ____ the past few days.",
    "options": [
      "in",
      "since",
      "for",
      "during"
    ],
    "correctAnswer": 2,
    "explanation": "We use 'for' with periods of time to indicate duration, while 'since' is used with specific points in time.",
    "difficulty": "medium",
    "id": 2784
  },
  {
    "type": "sentence-completion",
    "text": "The documentary ____ by millions of people since its release.",
    "options": [
      "watches",
      "has been watched",
      "watched",
      "was watching"
    ],
    "correctAnswer": 1,
    "explanation": "Present perfect passive ('has been watched') is needed to describe an action that started in the past and continues to the present.",
    "difficulty": "medium",
    "id": 2785
  },
  {
    "type": "sentence-completion",
    "text": "The concert was ____ loud that we had to leave early.",
    "options": [
      "too",
      "such",
      "very",
      "so"
    ],
    "correctAnswer": 3,
    "explanation": "The structure 'so + adjective + that' is used to express consequence. 'Such' would require a noun following it.",
    "difficulty": "medium",
    "id": 2787
  },
  {
    "type": "sentence-completion",
    "text": "By the time we arrived at the theater, the movie ____.",
    "options": [
      "had already started",
      "already started",
      "has already started",
      "was already starting"
    ],
    "correctAnswer": 0,
    "explanation": "Past perfect ('had already started') is required to show that one past action happened before another past action.",
    "difficulty": "medium",
    "id": 2788
  },
  {
    "type": "sentence-completion",
    "text": "The committee ____ the proposal before making their final decision.",
    "options": [
      "looked into",
      "looked for",
      "looked after",
      "looked up"
    ],
    "correctAnswer": 0,
    "explanation": "The phrasal verb 'look into' means to investigate or examine something, which fits the context of evaluating a proposal.",
    "difficulty": "medium",
    "id": 2789
  },
  {
    "type": "sentence-completion",
    "text": "The company is looking for someone who ____ experience in digital marketing.",
    "options": [
      "have",
      "had",
      "has",
      "having"
    ],
    "correctAnswer": 2,
    "explanation": "We need the third person singular form 'has' because it agrees with the singular subject 'someone' in the present tense.",
    "difficulty": "medium",
    "id": 2790
  },
  {
    "type": "sentence-completion",
    "text": "It's essential that every student ____ the assignment by Friday.",
    "options": [
      "completes",
      "completing",
      "completed",
      "complete"
    ],
    "correctAnswer": 3,
    "explanation": "After 'It's essential that' we use the subjunctive mood, which takes the base form of the verb ('complete') regardless of the subject.",
    "difficulty": "medium",
    "id": 2791
  },
  {
    "type": "sentence-completion",
    "text": "The documentary ____ interesting insights into wildlife conservation.",
    "options": [
      "provides",
      "provided",
      "providing",
      "provide"
    ],
    "correctAnswer": 0,
    "explanation": "Present simple 'provides' is needed for a general statement about what the documentary does. The subject is singular, requiring the -s ending.",
    "difficulty": "medium",
    "id": 2795
  },
  {
    "type": "sentence-completion",
    "text": "By this time next year, they ____ their new house.",
    "options": [
      "are building",
      "will build",
      "will have built",
      "have built"
    ],
    "correctAnswer": 2,
    "explanation": "Future perfect 'will have built' expresses an action that will be completed before a specific point in the future ('by this time next year').",
    "difficulty": "medium",
    "id": 2796
  },
  {
    "type": "sentence-completion",
    "text": "The company is looking for candidates who are ____ to work under pressure.",
    "options": [
      "possible",
      "potential",
      "capable",
      "able"
    ],
    "correctAnswer": 3,
    "explanation": "The adjective 'able' collocates with 'to' to describe a person's ability to do something. 'Able to work' is the correct expression here.",
    "difficulty": "medium",
    "id": 2798
  },
  {
    "type": "sentence-completion",
    "text": "The government has implemented several measures ____ reducing air pollution.",
    "options": [
      "directed",
      "targeted",
      "aimed at",
      "focusing"
    ],
    "correctAnswer": 2,
    "explanation": "The phrase 'aimed at' is followed by a gerund ('reducing') to express purpose. This is a fixed expression meaning 'designed for the purpose of'.",
    "difficulty": "medium",
    "id": 2799
  },
  {
    "type": "sentence-completion",
    "text": "You should ____ advantage of the free training courses offered by your company.",
    "options": [
      "have",
      "do",
      "take",
      "make"
    ],
    "correctAnswer": 2,
    "explanation": "The collocation 'take advantage of' means to use an opportunity beneficially. This is a fixed expression where only 'take' works correctly.",
    "difficulty": "medium",
    "id": 2800
  },
  {
    "type": "sentence-completion",
    "text": "If I ____ enough money, I would travel around the world.",
    "options": [
      "has",
      "having",
      "have",
      "had"
    ],
    "correctAnswer": 3,
    "explanation": "In second conditional sentences, we use the past simple tense 'had' in the if-clause to talk about hypothetical situations in the present.",
    "difficulty": "medium",
    "id": 2803
  },
  {
    "type": "sentence-completion",
    "text": "The museum was so crowded that we barely ____ to see the famous painting.",
    "options": [
      "being able",
      "are able",
      "been able",
      "were able"
    ],
    "correctAnswer": 3,
    "explanation": "Past tense 'were able' matches the past tense context ('was so crowded') and expresses ability in a specific past situation.",
    "difficulty": "medium",
    "id": 2804
  },
  {
    "type": "sentence-completion",
    "text": "She hasn't ____ her mind about attending the conference yet.",
    "options": [
      "made up",
      "made over",
      "made out",
      "made off"
    ],
    "correctAnswer": 0,
    "explanation": "The phrasal verb 'make up one's mind' means to decide or determine what to do, which fits the context of deciding about attending the conference.",
    "difficulty": "medium",
    "id": 2805
  },
  {
    "type": "sentence-completion",
    "text": "The new policy will be implemented ____ the board approves it next week.",
    "options": [
      "unless",
      "despite",
      "provided",
      "however"
    ],
    "correctAnswer": 2,
    "explanation": "'Provided' introduces a condition that must be met (board approval) for the main clause to happen (policy implementation), making it the appropriate conjunction here.",
    "difficulty": "medium",
    "id": 2806
  },
  {
    "type": "sentence-completion",
    "text": "The company has ____ a significant increase in sales since launching their new product line.",
    "options": [
      "experienced",
      "experiences",
      "experiencing",
      "experience"
    ],
    "correctAnswer": 0,
    "explanation": "Present perfect tense ('has experienced') is needed here to connect a past action with the present situation. The action started in the past and continues to be relevant.",
    "difficulty": "medium",
    "id": 2808
  },
  {
    "type": "sentence-completion",
    "text": "She spoke so ____ that nobody in the back row could hear what she was saying.",
    "options": [
      "quieter",
      "quietly",
      "quietness",
      "quiet"
    ],
    "correctAnswer": 1,
    "explanation": "An adverb ('quietly') is needed to modify the verb 'spoke'. Adverbs describe how an action is performed, while 'quiet' is an adjective that would describe a noun.",
    "difficulty": "medium",
    "id": 2809
  }
];

module.exports = questions;
