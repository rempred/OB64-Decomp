'use strict';

// Temporal held-out discovery replay. No compilation, source activation or acceptance.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const { ROOT } = require('./lib/phase7_conventional');
const { loadWorkbenchModel, resolveTarget } = require('./lib/matching/target_model');
const { selectFamilyCandidates } = require('./lib/matching/knowledge');

const cases = Object.freeze([
  { symbol: 'func_002AB810', cutoff: 'ea3dfaae^', symptom: 'scheduling-or-block-order' },
  { symbol: 'func_002AAC60', cutoff: '8eaabdfc^', symptom: 'register-allocation' },
  { symbol: 'func_000c9850', cutoff: 'fece5b83^', symptom: 'stack-layout-or-offset-family' },
]);

function git(args, trim = true) {
  const result = cp.execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  return trim ? result.trim() : result;
}

function main() {
  const workbench = loadWorkbenchModel();
  const results = cases.map(query => {
    const cutoff = git(['rev-parse', query.cutoff]);
    const files = new Set(git(['ls-tree', '-r', '--name-only', cutoff, '--', 'src', 'docs/dossiers']).split('\n'));
    const indexText = git(['show', `${cutoff}:docs/matching-c/compiler-lessons.json`], false);
    const index = JSON.parse(indexText);
    const historical = workbench.targets.map(target => {
      const source = target.activeMatchingSource || target.activeMatchingProducer?.source;
      const { activeMatchingSource, activeMatchingProducer, ...rest } = target;
      return source && files.has(source) ? { ...rest, activeMatchingSource: source } : rest;
    });
    const own = query.symbol.toLowerCase();
    const records = [...files].filter(file => file.endsWith('.observation.json')).map(file => {
      const symbol = path.basename(file).match(/^(func_[0-9a-f]+|boot_[a-z0-9_]+)-/i)?.[1];
      return symbol ? { metadataPath: file, envelope: { symbol } } : null;
    }).filter(Boolean);
    const target = resolveTarget(workbench, query.symbol);
    const families = selectFamilyCandidates(target, historical, records);
    // Remove lessons explicitly naming the held-out target from discovery.
    const ownAddress = own.replace('func_', '');
    const lessons = index.lessons.filter(lesson => lesson.symptoms.includes(query.symptom)
      && !JSON.stringify(lesson).toLowerCase().includes(ownAddress));
    return {
      ...query, cutoff,
      indexSha256: crypto.createHash('sha256').update(indexText).digest('hex').toUpperCase(),
      familyTopThree: families.slice(0, 3).map(row => ({
        symbol: row.target.symbol, tier: row.tier,
        source: row.target.activeMatchingSource || null,
        metadata: row.records.map(record => record.metadataPath),
      })),
      familyTotal: families.length,
      compactLessonIds: lessons.slice(0, 3).map(lesson => lesson.id),
      omittedLessonCount: Math.max(0, lessons.length - 3),
      detailedLessons: lessons.map(lesson => ({
        id: lesson.id, applicability: lesson.applicability,
        note: lesson.note, references: lesson.references,
      })),
    };
  });
  const output = path.join(ROOT, 'build/research/retrieval-replay-20261117/report.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const report = {
    generator: 'tools/replay_knowledge_20261117.js',
    protocol: 'Three frozen recent solves, parent of each acceptance commit, target-specific lessons excluded, historical index blobs and donor availability only. No rank tuning uses outcomes.',
    limits: [
      'Current accepted assembly model supplies structural representations. Historical model equivalence is not established.',
      'Discovery only. Donor source/header authentication and transfer are not executed.',
      'Filename-based historical dossier discovery establishes candidate availability only.',
      'Cases were selected retrospectively by a researcher aware of outcomes. This is temporal held-out retrieval, not a blind human trial or measured matching speedup.',
    ],
    results,
  };
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ output, results: results.map(result => ({
    symbol: result.symbol, cutoff: result.cutoff, familyTopThree: result.familyTopThree,
    compactLessonIds: result.compactLessonIds, omittedLessonCount: result.omittedLessonCount,
  })) }, null, 2));
}

if (require.main === module) main();
module.exports = { cases, main };
