#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/phase7_conventional');
const {
  assertCandidateComparisonInputs,
  assertCandidateComparisonResult,
  compareCaseCfg,
  resolveCandidateComparisonContract,
} = require('./lib/matching/case_cfg');
const { compileCandidate } = require('./lib/matching/compiler');
const { initializeStore } = require('./lib/matching/store');
const { loadWorkbenchModel, resolveTarget } = require('./lib/matching/target_model');

const SYMBOL = 'func_00284288';
const CANDIDATE_ID = '9ED0FDEE460C920DC9A3906DE125591A33055CC4F0175249790959EFBB8FFD16';
const CASE_MAP = path.join(ROOT, 'docs', 'audit', 'evidence',
  '2026-08-31-func-00284288-preparatory', 'case-cfg-map.json');
const OUTPUT = path.join(ROOT, 'build', 'matching', 'targets', SYMBOL, 'research',
  'structured-skeleton-case-cfg.json');

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

function nonnegativeInteger(value, label) {
  if (typeof value === 'string' && /^(?:0x[0-9a-f]+|[0-9]+)$/i.test(value)) {
    const parsed = Number.parseInt(value, 0);
    if (Number.isSafeInteger(parsed) && parsed >= 0) return parsed;
  }
  throw new Error(`${label} must be a nonnegative integer`);
}

function parseArgs(argv) {
  const result = { actualTails: [] };
  const seen = new Set();
  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index];
    if (!['--actual-dispatch', '--actual-body', '--actual-tail'].includes(option)) {
      throw new Error(`unknown argument: ${option}`);
    }
    const value = argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`${option} requires a value`);
    if (option !== '--actual-tail' && seen.has(option)) throw new Error(`${option} may not be repeated`);
    seen.add(option);
    if (option === '--actual-dispatch') result.actualDispatch = nonnegativeInteger(value, option);
    else if (option === '--actual-body') result.actualBody = nonnegativeInteger(value, option);
    else {
      const match = /^([^=]+)=(0x[0-9a-f]+|[0-9]+)$/i.exec(value);
      if (!match || !match[1].trim()) throw new Error('--actual-tail requires name=offset');
      result.actualTails.push({ name: match[1].trim(), offset: nonnegativeInteger(match[2], '--actual-tail offset') });
    }
  }
  if (result.actualDispatch === undefined || result.actualBody === undefined || !result.actualTails.length) {
    throw new Error('required inputs: --actual-dispatch <offset> --actual-body <offset> --actual-tail <name=offset>');
  }
  return result;
}

function repoFile(relative, label) {
  if (typeof relative !== 'string' || path.isAbsolute(relative)) throw new Error(`${label} is not repository-relative`);
  const resolved = path.resolve(ROOT, relative);
  const back = path.relative(ROOT, resolved);
  if (!back || back === '..' || back.startsWith(`..${path.sep}`)) throw new Error(`${label} escapes the repository`);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) throw new Error(`${label} is missing: ${relative}`);
  return resolved;
}

function symbolResolver(workbench) {
  const byEntry = new Map();
  for (const target of workbench.targets) {
    const entry = target.entryVram >>> 0;
    if (!byEntry.has(entry)) byEntry.set(entry, []);
    byEntry.get(entry).push(target.symbol);
  }
  return (address) => {
    const symbols = byEntry.get(address >>> 0) || [];
    return symbols.length === 1
      ? symbols[0]
      : `func_${(address >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
  };
}

function main() {
  const inputs = parseArgs(process.argv.slice(2));
  const caseMap = JSON.parse(fs.readFileSync(CASE_MAP, 'utf8'));
  if (caseMap.schemaVersion !== 2 || caseMap.symbol !== SYMBOL || !Array.isArray(caseMap.commands)) {
    throw new Error('tracked func_00284288 case-CFG map is malformed');
  }
  const contract = resolveCandidateComparisonContract(caseMap, CANDIDATE_ID);
  if (typeof contract.source !== 'string'
      || !/^[0-9A-F]{64}$/.test(String(contract.sourceSha256 || ''))
      || typeof contract.sourceClass !== 'string'
      || !contract.expectedSummary
      || !/^[0-9A-F]{64}$/.test(String(contract.expectedResultDigest || ''))) {
    throw new Error('tracked func_00284288 candidate reproduction contract is incomplete');
  }
  const sourceFile = repoFile(contract.source, 'tracked archived candidate');
  const sourceText = fs.readFileSync(sourceFile, 'utf8');
  if (sha256(sourceText) !== contract.sourceSha256) {
    throw new Error('tracked archived candidate source SHA-256 differs from its case-CFG contract');
  }

  const workbench = loadWorkbenchModel();
  const target = resolveTarget(workbench, SYMBOL);
  const reproductionRoot = path.join(ROOT, 'build', 'matching', 'targets', SYMBOL, 'case-cfg-reproduction');
  fs.mkdirSync(reproductionRoot, { recursive: true });
  const isolatedRoot = fs.mkdtempSync(path.join(reproductionRoot, 'isolated-'));
  const database = path.join(isolatedRoot, 'workbench.sqlite');
  initializeStore({ database });
  const compiled = compileCandidate(workbench, target, sourceText, {
    origin: 'case-cfg-reproduction',
    metadata: { caseMap: path.relative(ROOT, CASE_MAP).replace(/\\/g, '/') },
    storeOptions: { database },
  });
  if (compiled.candidate.candidateId !== contract.candidateId) {
    throw new Error(`fresh candidate identity drift: ${compiled.candidate.candidateId}`);
  }
  if (compiled.compile.status !== 'compiled' || !compiled.compile.object_text) {
    throw new Error(`fresh candidate compile failed: ${compiled.compile.stderr || compiled.compile.status}`);
  }
  if (compiled.compile.source_class !== contract.sourceClass) {
    throw new Error(`fresh candidate source class drift: ${compiled.compile.source_class}`);
  }

  const actualBuffer = Buffer.from(compiled.compile.object_text, 'base64');
  const actualDispatch = {
    dispatchOffset: inputs.actualDispatch,
    bodyOffset: inputs.actualBody,
    valueRegister: contract.actualDispatch.valueRegister,
    initialRegisters: contract.actualDispatch.initialRegisters,
    localJumpMode: contract.actualDispatch.localJumpMode,
    ...(contract.actualDispatch.maximumSteps === undefined
      ? {} : { maximumSteps: contract.actualDispatch.maximumSteps }),
  };
  assertCandidateComparisonInputs(contract, actualDispatch, inputs.actualTails, actualBuffer.length);
  const report = compareCaseCfg(target.expectedBytes, actualBuffer, {
    start: target.vramStart,
    symbol: target.symbol,
    commands: caseMap.commands,
    expectedDispatch: caseMap.expectedDispatch,
    actualDispatch,
    expectedTails: caseMap.expectedTails,
    actualTails: inputs.actualTails,
    actualRelocations: compiled.compile.relocations || [],
    symbolForAddress: symbolResolver(workbench),
    candidate: {
      candidateId: compiled.candidate.candidateId,
      runId: compiled.compile.run_id,
      sourceClass: compiled.compile.source_class,
    },
  });
  assertCandidateComparisonResult(contract, report);
  report.caseMap = path.relative(ROOT, CASE_MAP).replace(/\\/g, '/');
  report.reproduction = {
    script: 'tools/reproduce_func_00284288_case_cfg.js',
    source: contract.source,
    sourceSha256: contract.sourceSha256,
    isolatedDatabase: path.relative(ROOT, database).replace(/\\/g, '/'),
  };
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({
    report: path.relative(ROOT, OUTPUT).replace(/\\/g, '/'),
    candidate: report.candidate,
    actualInputs: report.comparisonContract.actualInputs,
    summary: report.summary,
    resultDigest: report.resultDigest,
    isolatedDatabase: report.reproduction.isolatedDatabase,
    evidenceBoundary: report.evidenceBoundary,
  }, null, 2));
}

main();
