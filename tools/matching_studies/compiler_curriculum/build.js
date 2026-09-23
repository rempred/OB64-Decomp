#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {hash, features, partition, queryFromRecord, evaluate} = require('./corpus');
const {loadWorkbenchModel, assertScratchCapability} = require('../../lib/matching/target_model');
const {prepareCompilerSession, compileScratchCandidate} = require('../../lib/matching/compiler');
const {classifySource} = require('../../lib/source_policy');

const ROOT = path.resolve(__dirname, '../../..');

function argumentsFor(args) {
  const options = {limit: 16, maxBytes: 1024, symbols: null};
  for (let i = 0; i < args.length; i++) {
    const option = args[i];
    if (!['--limit', '--max-bytes', '--symbols'].includes(option) || i + 1 === args.length) throw new Error('Usage: build.js [--limit 16] [--max-bytes 1024] [--symbols name,name]');
    const value = args[++i];
    if (option === '--symbols') options.symbols = value.split(',').filter(Boolean);
    else options[option === '--limit' ? 'limit' : 'maxBytes'] = Number(value);
  }
  if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 1000
      || !Number.isInteger(options.maxBytes) || options.maxBytes < 8 || options.maxBytes > 65536) throw new Error('Invalid curriculum bounds');
  return options;
}

function writeJson(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', {flag: 'wx'}); }
function writeJsonl(file, rows) { fs.writeFileSync(file, rows.map(row => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''), {flag: 'wx'}); }

function selectTargets(targets, limit) {
  const buckets = new Map(['straight-line', 'control-flow', 'calls-and-context'].map(stage => [stage, []]));
  for (const target of [...targets].sort((a, b) => hash(a.symbol).localeCompare(hash(b.symbol)))) {
    buckets.get(features(target.expectedBytes.toString('hex'), target.vramStart).stage).push(target);
  }
  const selected = [];
  while (selected.length < limit) {
    let added = false;
    for (const bucket of buckets.values()) {
      if (bucket.length && selected.length < limit) { selected.push(bucket.shift()); added = true; }
    }
    if (!added) break;
  }
  return selected;
}

function main(args = process.argv.slice(2)) {
  const options = argumentsFor(args);
  const started = Date.now();
  const run = path.join(ROOT, 'build', 'compiler-curriculum', `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomBytes(3).toString('hex')}`);
  fs.mkdirSync(run, {recursive: true});
  const model = loadWorkbenchModel();
  const selected = new Set((options.symbols || []).map(symbol => {
    const target = model.bySymbol.get(symbol.toLowerCase());
    if (!target) throw new Error(`Unknown requested symbol: ${symbol}`);
    return target.symbol.toLowerCase();
  }));
  const candidates = selectTargets(model.targets.filter(target => target.activeMatchingSource && target.bytes <= options.maxBytes
    && (!options.symbols || selected.has(target.symbol.toLowerCase()))), options.limit);
  if (candidates.length === 0) throw new Error('No active source targets meet the explicit bounds');
  const preparationStarted = Date.now();
  const session = prepareCompilerSession();
  const preparationMs = Date.now() - preparationStarted;
  const examples = [];
  const attempts = [];
  for (const target of candidates) {
    const itemStarted = Date.now();
    const attempt = {symbol: target.symbol, source: target.activeMatchingSource, status: 'excluded', compileRequested: false};
    try {
      assertScratchCapability(model, target, session.context.phase8.targets);
      const sourceFile = path.resolve(ROOT, target.activeMatchingSource);
      const classification = classifySource(target.activeMatchingSource, {preprocessor: session.preprocessor});
      attempt.sourceClass = classification.class;
      if (classification.class !== 'PURE_C') throw new Error(`Curriculum excludes ${classification.class} sources`);
      const sourceText = fs.readFileSync(sourceFile, 'utf8');
      const artifactDir = path.join(run, 'artifacts', target.symbol);
      attempt.compileRequested = true;
      const output = compileScratchCandidate({session, target, sourceFile, artifactDir, classification});
      const sourceHash = hash(sourceText);
      if (sourceHash !== hash(fs.readFileSync(sourceFile, 'utf8'))) throw new Error('Source changed during curriculum compilation');
      const row = {
        schemaVersion: 1, symbol: target.symbol,
        aliases: [target.requestedSymbol, ...(target.logicalAliases || []).map(value => typeof value === 'string' ? value : value.symbol)].filter(Boolean),
        targetId: target.targetId, modelId: model.modelId, sourcePath: target.activeMatchingSource,
        sourceText, sourceClass: classification.class, sourceSha256: sourceHash,
        toolId: session.toolId, vramStart: target.vramStart,
        objectHex: output.objectText.toString('hex'), objectSha256: hash(output.objectText),
        retailHex: target.expectedBytes.toString('hex'), retailSha256: hash(target.expectedBytes),
        relocations: output.relocations,
        compilerAssembly: fs.readFileSync(path.join(artifactDir, 'candidate.compiler.s'), 'utf8'),
        compilationInputSha256: classification.compilationInput.sha256,
        artifactDirectory: path.relative(ROOT, artifactDir).replace(/\\/g, '/'),
        provenance: output.scratchContract,
        stage: features(target.expectedBytes.toString('hex'), target.vramStart).stage,
        evidence: {kind: 'fresh-pinned-compiler-pair', activeSourceAtExport: true,
          rawObjectEqualsRetail: output.objectText.equals(target.expectedBytes),
          productionAcceptanceRevalidated: false,
          limitation: 'Object/source pairing is verified; this export does not re-run the canonical linked/full-ROM gates.'},
      };
      examples.push(row);
      attempt.status = 'compiled-pair';
    } catch (error) { attempt.reason = error.message; }
    attempt.elapsedMs = Date.now() - itemStarted;
    attempts.push(attempt);
    process.stdout.write(JSON.stringify(attempt) + '\n');
  }
  const rows = partition(examples);
  const report = evaluate(rows);
  writeJsonl(path.join(run, 'training.jsonl'), rows.filter(row => row.fold !== 0));
  writeJsonl(path.join(run, 'evaluation-queries.jsonl'), rows.filter(row => row.fold === 0).map(queryFromRecord));
  writeJsonl(path.join(run, 'evaluation-answers.jsonl'), rows.filter(row => row.fold === 0));
  writeJson(path.join(run, 'retrieval-evaluation.json'), report);
  const manifest = {
    schemaVersion: 1, modelId: model.modelId, toolId: session.toolId, tool: session.tool,
    options, preparationMs, elapsedMs: Date.now() - started,
    candidateCount: candidates.length, compiledPairs: rows.length,
    compileRequests: attempts.filter(row => row.compileRequested).length,
    attempts, split: {foldCount: 5, evaluationFold: 0,
      policy: 'Transitive grouping by function/alias, source, object, retail bytes and opcode/CFG family; no family straddles folds.'},
    report,
  };
  writeJson(path.join(run, 'manifest.json'), manifest);
  process.stdout.write(JSON.stringify({run, compiledPairs: rows.length, report}, null, 2) + '\n');
  if (!rows.length) process.exitCode = 1;
  return {run, manifest};
}

if (require.main === module) main();
module.exports = {argumentsFor, selectTargets, main};
