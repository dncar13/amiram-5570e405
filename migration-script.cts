import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// We'll load questions dynamically to avoid import issues

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.PUBLIC_SUPABASE_ANON_KEY!
)

interface QuestionFile {
  questions: any[]
  type: string
  difficulty: string
  filePath: string
}

interface PassageData {
  original_id: number
  title: string
  content: string
  topic: string
  general_subject: string
  word_count: number
  estimated_reading_time: number
  line_count: number
  difficulty: string
  metadata: any
}

interface TopicData {
  id: number
  name: string
  category: string
  description: string
}

async function migrateQuestions() {
  const batchId = `migration-${Date.now()}`
  console.log(`🚀 Starting migration batch: ${batchId}`)
  
  try {
    // Step 1: Extract and upload passages
    console.log('📖 Processing passages...')
    const passages = await extractAndUploadPassages()
    
    // Step 2: Upload topics
    console.log('🏷️  Processing topics...')
    const topics = await uploadTopics()
    
    // Step 3: Load all questions
    console.log('📋 Loading all questions...')
    const allQuestions = await loadAllQuestions()
    
    // Step 4: Upload question sets
    console.log('📦 Creating question sets...')
    const questionSets = await createQuestionSets(passages, allQuestions)
    
    // Step 5: Transform and upload questions in batches
    console.log('❓ Uploading questions...')
    await uploadQuestions(allQuestions, passages, topics, questionSets)
    
    // Step 6: Log migration summary
    await logMigrationSummary(batchId, allQuestions.length)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

async function extractAndUploadPassages(): Promise<{ [key: string]: any }> {
  const passages: PassageData[] = []

  // Extract passage from gigEconomyReadingQuestions.ts
  const gigEconomyContent = fs.readFileSync('/home/daniel_pogodin/amiram/src/data/questions/by-type/gigEconomyReadingQuestions.ts', 'utf8')
  const gigEconomyPassageMatch = gigEconomyContent.match(/const gigEconomyPassageText = `(.*?)`;/s)
  if (gigEconomyPassageMatch) {
    const passageText = gigEconomyPassageMatch[1]
    passages.push({
      original_id: 1,
      title: "The Rise of the Gig Economy",
      content: passageText,
      topic: "Gig Economy",
      general_subject: "Economics",
      word_count: passageText.split(/\s+/).length,
      estimated_reading_time: 3,
      line_count: passageText.split('\n').length,
      difficulty: "medium",
      metadata: {
        source: "gigEconomyReadingQuestions.ts",
        tags: ["employment", "economy", "labor-market"]
      }
    })
  }

  // Extract passage from mediumTechnologyReadingQuestions.ts
  const technologyContent = fs.readFileSync('/home/daniel_pogodin/amiram/src/data/questions/by-type/mediumTechnologyReadingQuestions.ts', 'utf8')
  const technologyPassageMatch = technologyContent.match(/const technologyPassageText = `(.*?)`;/s)
  if (technologyPassageMatch) {
    const passageText = technologyPassageMatch[1]
    passages.push({
      original_id: 2,
      title: "Technology Reading",
      content: passageText,
      topic: "Technology",
      general_subject: "Technology",
      word_count: passageText.split(/\s+/).length,
      estimated_reading_time: 3,
      line_count: passageText.split('\n').length,
      difficulty: "medium",
      metadata: {
        source: "mediumTechnologyReadingQuestions.ts",
        tags: ["artificial-intelligence", "digital-revolution", "society"]
      }
    })
  }

  // Extract passage from mediumEnvironmentReadingQuestions.ts
  const environmentContent = fs.readFileSync('/home/daniel_pogodin/amiram/src/data/questions/by-type/mediumEnvironmentReadingQuestions.ts', 'utf8')
  const environmentPassageMatch = environmentContent.match(/const environmentPassageText = `(.*?)`;/s)
  if (environmentPassageMatch) {
    const passageText = environmentPassageMatch[1]
    passages.push({
      original_id: 3,
      title: "Environment Reading",
      content: passageText,
      topic: "Environment",
      general_subject: "Environmental Science",
      word_count: passageText.split(/\s+/).length,
      estimated_reading_time: 3,
      line_count: passageText.split('\n').length,
      difficulty: "medium",
      metadata: {
        source: "mediumEnvironmentReadingQuestions.ts",
        tags: ["ecosystem-services", "environmental-protection", "sustainability"]
      }
    })
  }

  const { data, error } = await supabase
    .from('passages')
    .upsert(passages, { onConflict: 'original_id' })
    .select('id, original_id, title')

  if (error) {
    console.error('❌ Error uploading passages:', error)
    throw error
  }

  console.log(`✅ Uploaded ${data.length} passages`)
  
  // Create mapping from title to passage_id
  const passageMap: { [key: string]: any } = {}
  data.forEach(passage => {
    passageMap[passage.title] = passage
  })
  
  return passageMap
}

async function uploadTopics(): Promise<{ [key: string]: any }> {
  const topics: TopicData[] = [
    { id: 1, name: "vocabulary", category: "Language", description: "Vocabulary questions" },
    { id: 2, name: "restatement", category: "Language", description: "Restatement questions" },
    { id: 3, name: "sentence-completion", category: "Language", description: "Sentence completion questions" },
    { id: 4, name: "reading-comprehension", category: "Reading", description: "Reading comprehension questions" },
    { id: 5, name: "Technology", category: "Subject", description: "Technology-related content" },
    { id: 6, name: "Gig Economy", category: "Subject", description: "Gig economy content" },
    { id: 7, name: "Environment", category: "Subject", description: "Environmental content" }
  ]

  const { data, error } = await supabase
    .from('topics')
    .upsert(topics, { onConflict: 'id' })
    .select('id, name')

  if (error) {
    console.error('❌ Error uploading topics:', error)
    throw error
  }

  console.log(`✅ Uploaded ${data.length} topics`)
  
  // Create mapping from name to topic_id
  const topicMap: { [key: string]: any } = {}
  data.forEach(topic => {
    topicMap[topic.name] = topic
  })
  
  return topicMap
}

async function loadAllQuestions(): Promise<any[]> {
  const allQuestions: any[] = []

  // Load reading comprehension questions
  const readingFiles = [
    '/home/daniel_pogodin/amiram/src/data/questions/by-type/gigEconomyReadingQuestions.ts',
    '/home/daniel_pogodin/amiram/src/data/questions/by-type/mediumTechnologyReadingQuestions.ts',
    '/home/daniel_pogodin/amiram/src/data/questions/by-type/mediumEnvironmentReadingQuestions.ts'
  ]

  for (const filePath of readingFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      
      // Extract the exported questions array
      const exportMatch = fileContent.match(/export const \w+ReadingQuestions: Question\[\] = \[(.*?)\];/s)
      if (exportMatch) {
        const questionsStr = '[' + exportMatch[1] + ']'
        const questions = eval(questionsStr)
        allQuestions.push(...questions.map((q: any) => ({ ...q, sourceFile: path.basename(filePath) })))
      }
    } catch (error) {
      console.error(`❌ Error loading ${filePath}:`, error)
    }
  }

  // Load questions from questions-for-lovable directory
  const questionFiles = [
    '/home/daniel_pogodin/amiram/questions-for-lovable/vocabulary/easy/vocabulary-easy-2025-06-11.ts',
    '/home/daniel_pogodin/amiram/questions-for-lovable/vocabulary/medium/vocabulary-medium-2025-06-11.ts',
    '/home/daniel_pogodin/amiram/questions-for-lovable/vocabulary/hard/vocabulary-hard-2025-06-11.ts',
    '/home/daniel_pogodin/amiram/questions-for-lovable/restatement/easy/restatement-easy-2025-06-11.ts',
    '/home/daniel_pogodin/amiram/questions-for-lovable/restatement/medium/restatement-medium-2025-06-11.ts',
    '/home/daniel_pogodin/amiram/questions-for-lovable/restatement/hard/restatement-hard-2025-06-11.ts',
    '/home/daniel_pogodin/amiram/questions-for-lovable/sentence-completion/easy/sentence-completion-easy-2025-06-11.ts',
    '/home/daniel_pogodin/amiram/questions-for-lovable/sentence-completion/medium/sentence-completion-medium-2025-06-11.ts',
    '/home/daniel_pogodin/amiram/questions-for-lovable/sentence-completion/hard/sentence-completion-hard-2025-06-11.ts'
  ]

  for (const filePath of questionFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      
      // Extract questions array from the file content
      const questionsMatch = fileContent.match(/const questions.*?= \[(.*?)\];/s)
      if (questionsMatch) {
        const questionsStr = '[' + questionsMatch[1] + ']'
        const questions = eval(questionsStr)
        allQuestions.push(...questions.map((q: any) => ({ ...q, sourceFile: path.basename(filePath) })))
      }
    } catch (error) {
      console.error(`❌ Error loading ${filePath}:`, error)
    }
  }

  console.log(`✅ Loaded ${allQuestions.length} total questions`)
  return allQuestions
}

async function createQuestionSets(passages: { [key: string]: any }, allQuestions: any[]): Promise<{ [key: string]: any }> {
  const questionSets = []

  // Create sets for reading comprehension (one per passage)
  Object.values(passages).forEach((passage: any) => {
    const questionsForPassage = allQuestions.filter(q => q.passageTitle === passage.title)
    questionSets.push({
      name: `${passage.title} - Reading Comprehension`,
      type: 'reading-comprehension',
      passage_id: passage.id,
      difficulty: 'medium',
      question_count: questionsForPassage.length,
      metadata: {
        passage_title: passage.title,
        created_from: 'reading-comprehension'
      }
    })
  })

  // Create sets for other question types (by type + difficulty)
  const otherQuestions = allQuestions.filter(q => q.type !== 'reading-comprehension')
  const setGroups = new Map()
  
  otherQuestions.forEach(q => {
    const key = `${q.type}-${q.difficulty}`
    if (!setGroups.has(key)) {
      setGroups.set(key, [])
    }
    setGroups.get(key).push(q)
  })

  setGroups.forEach((questions, key) => {
    const [type, difficulty] = key.split('-')
    questionSets.push({
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      type: type,
      passage_id: null,
      difficulty: difficulty,
      question_count: questions.length,
      metadata: {
        question_type: type,
        created_from: 'questions-for-lovable'
      }
    })
  })

  const { data, error } = await supabase
    .from('question_sets')
    .upsert(questionSets, { onConflict: 'name' })
    .select('id, name, type, difficulty, passage_id')

  if (error) {
    console.error('❌ Error creating question sets:', error)
    throw error
  }

  console.log(`✅ Created ${data.length} question sets`)
  
  // Create mapping from set characteristics to set_id
  const setMap: { [key: string]: any } = {}
  data.forEach(set => {
    setMap[set.name] = set
  })
  
  return setMap
}

async function uploadQuestions(
  allQuestions: any[],
  passages: { [key: string]: any },
  topics: { [key: string]: any },
  questionSets: { [key: string]: any }
): Promise<void> {
  const BATCH_SIZE = 100
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < allQuestions.length; i += BATCH_SIZE) {
    const batch = allQuestions.slice(i, i + BATCH_SIZE)
    
    const transformedQuestions = batch.map(q => {
      let passage_id = null
      let topic_id = topics[q.type]?.id || 1
      let set_id = null

      // Handle reading comprehension questions
      if (q.type === 'reading-comprehension') {
        const passage = Object.values(passages).find((p: any) => p.title === q.passageTitle)
        passage_id = passage?.id || null
        topic_id = topics['reading-comprehension']?.id || 4
        set_id = Object.values(questionSets).find((s: any) => s.passage_id === passage_id)?.id || null
      } else {
        // Handle other question types
        const setName = `${q.type.charAt(0).toUpperCase() + q.type.slice(1)} - ${q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}`
        set_id = questionSets[setName]?.id || null
      }

      return {
        original_id: q.id,
        type: q.type,
        question_text: q.text,
        answer_options: q.options,
        correct_answer: q.correctAnswer.toString(), // Convert to string!
        explanation: q.explanation,
        difficulty: q.difficulty,
        passage_id: passage_id,
        topic_id: topic_id,
        set_id: set_id,
        question_subtype: q.type,
        version: 1,
        metadata: {
          source_file: q.sourceFile,
          original_tags: q.tags || [],
          original_metadata: q.metadata || {}
        }
      }
    })

    try {
      const { data, error } = await supabase
        .from('questions')
        .upsert(transformedQuestions, { onConflict: 'original_id,type' })
        .select('id')

      if (error) {
        console.error(`❌ Error uploading batch ${i / BATCH_SIZE + 1}:`, error)
        errorCount += batch.length
      } else {
        successCount += data.length
        console.log(`✅ Uploaded batch ${i / BATCH_SIZE + 1}: ${data.length} questions`)
      }
    } catch (batchError) {
      console.error(`❌ Batch ${i / BATCH_SIZE + 1} failed:`, batchError)
      errorCount += batch.length
    }
  }

  console.log(`\n📊 Upload Summary:`)
  console.log(`✅ Successfully uploaded: ${successCount} questions`)
  console.log(`❌ Failed: ${errorCount} questions`)
  console.log(`📊 Total processed: ${allQuestions.length} questions`)
}

async function logMigrationSummary(batchId: string, totalQuestions: number): Promise<void> {
  const summary = {
    batch_id: batchId,
    total_questions: totalQuestions,
    timestamp: new Date().toISOString(),
    status: 'completed'
  }

  const { error } = await supabase
    .from('migration_logs')
    .insert([summary])

  if (error) {
    console.error('❌ Error logging migration summary:', error)
  } else {
    console.log('✅ Migration summary logged')
  }

  console.log(`\n🎉 Migration completed successfully!`)
  console.log(`📋 Batch ID: ${batchId}`)
  console.log(`📊 Total questions processed: ${totalQuestions}`)
}

// Run the migration
if (require.main === module) {
  migrateQuestions()
    .then(() => {
      console.log('🎉 Migration completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    })
}

export { migrateQuestions }