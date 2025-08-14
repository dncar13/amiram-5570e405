#!/usr/bin/env node
// delete-generated-questions.cjs - Safe cleanup for AI-generated questions
require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');

function parseArgs() {
  const args = {
    types: ['listening_comprehension','listening_continuation','word_formation','grammar_in_context'],
    chapter: null,
    since: null,
    onlyAI: true,
    dryRun: true,
    exportPath: null,
  };
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--types=')) {
      const map = { lc: 'listening_comprehension', cont: 'listening_continuation', wf: 'word_formation', gc: 'grammar_in_context' };
      args.types = arg.split('=')[1].split(',').map(x => x.trim()).map(x => map[x] || x);
    } else if (arg.startsWith('--chapter=')) {
      args.chapter = arg.split('=')[1];
    } else if (arg.startsWith('--since=')) {
      args.since = new Date(arg.split('=')[1]);
      if (isNaN(args.since)) args.since = null;
    } else if (arg === '--all-chapters') {
      args.chapter = null;
    } else if (arg === '--include-non-ai') {
      args.onlyAI = false;
    } else if (arg === '--no-dry-run') {
      args.dryRun = false;
    } else if (arg.startsWith('--export=')) {
      args.exportPath = arg.split('=')[1];
    }
  });
  return args;
}

function validateEnv() {
  const required = ['VITE_SUPABASE_URL','VITE_SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) throw new Error(`Missing env: ${missing.join(', ')}`);
}

async function main() {
  validateEnv();
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);
  const opts = parseArgs();

  console.log('🔍 Scanning for generated questions to delete...');
  console.log(`   Types: ${opts.types.join(', ')}`);
  console.log(`   Chapter: ${opts.chapter || 'ANY'}`);
  console.log(`   Since: ${opts.since ? opts.since.toISOString() : 'ANY'}`);
  console.log(`   Only AI: ${opts.onlyAI ? 'YES' : 'NO'}`);
  console.log(`   Mode: ${opts.dryRun ? 'DRY RUN' : 'DELETE'}`);

  // Fetch candidates in pages to avoid large payloads
  const pageSize = 1000;
  let from = 0;
  let totalFetched = 0;
  const candidates = [];

  while (true) {
    let query = supabase
      .from('questions')
      .select('id, type, ai_generated, created_at, metadata, stable_id')
      .in('type', opts.types)
      .range(from, from + pageSize - 1);

    if (opts.onlyAI) query = query.eq('ai_generated', true);

    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) break;

    data.forEach(row => {
      const chapter = row.metadata && (row.metadata.chapter || row.metadata.Chapter || null);
      const createdAt = row.created_at ? new Date(row.created_at) : null;
      if (opts.chapter && chapter !== opts.chapter) return;
      if (opts.since && createdAt && createdAt < opts.since) return;
      candidates.push(row);
    });

    totalFetched += data.length;
    if (data.length < pageSize) break;
    from += pageSize;
  }

  // Group by type for summary
  const byType = candidates.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1; return acc;
  }, {});

  console.log(`\n📊 Candidates summary:`);
  Object.entries(byType).forEach(([t,c]) => console.log(`   • ${t}: ${c}`));
  console.log(`   Total: ${candidates.length}`);

  if (opts.exportPath && candidates.length) {
    const fs = require('fs');
    fs.writeFileSync(opts.exportPath, JSON.stringify(candidates, null, 2));
    console.log(`💾 Exported candidates to ${opts.exportPath}`);
  }

  if (opts.dryRun) {
    console.log(`\n✅ DRY RUN only. No deletions performed.`);
    return;
  }

  if (!candidates.length) {
    console.log('✅ Nothing to delete.');
    return;
  }

  console.log('\n🗑️ Deleting...');
  // Delete in batches of 1000 IDs
  const ids = candidates.map(c => c.id);
  let deleted = 0;
  while (ids.length) {
    const batch = ids.splice(0, 1000);
    const { error } = await supabase.from('questions').delete().in('id', batch);
    if (error) throw error;
    deleted += batch.length;
    console.log(`   Deleted ${deleted}/${candidates.length}`);
  }

  console.log(`\n✅ Done. Deleted ${deleted} records.`);
}

main().catch(err => {
  console.error('❌ Cleanup failed:', err.message);
  process.exit(1);
});
