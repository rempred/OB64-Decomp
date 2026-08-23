'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, sha256File } = require('../phase7_conventional');
const { verifyCompiler } = require('../phase8_matching_c');
const { prepareContext, writeJson } = require('../current_workflow');
const { canonicalJson, digest } = require('./target_model');
const { MATCHING_ROOT } = require('./compiler');

const PASSES = Object.freeze([
  ['rtl', '-dr', '.rtl'],
  ['jump', '-dj', '.jump'],
  ['cse', '-ds', '.cse'],
  ['loop', '-dL', '.loop'],
  ['cse2', '-dt', '.cse2'],
  ['flow', '-df', '.flow'],
  ['combine', '-dc', '.combine'],
  ['schedule1', '-dS', '.sched'],
  ['local-allocation', '-dl', '.lreg'],
  ['global-allocation', '-dg', '.greg'],
  ['schedule2', '-dR', '.sched2'],
  ['late-jump', '-dJ', '.jump2'],
  ['delay-slots', '-dd', '.dbr'],
]);

function runProbe(workbench, target, sourceText, options = {}) {
  const context = options.context || prepareContext();
  const researchCompiler = options.researchCompiler ? path.resolve(options.researchCompiler) : null;
  const compiler = researchCompiler || context.localTools.compiler;
  if (!fs.existsSync(compiler) || !fs.statSync(compiler).isFile()) throw new Error(`probe compiler is missing: ${compiler}`);
  if (!researchCompiler) verifyCompiler(context.phase8, compiler);
  const knownPasses = new Set(PASSES.map(([name]) => name));
  const unknownPasses = (options.passes || []).filter((name) => !knownPasses.has(name));
  if (unknownPasses.length) throw new Error(`unknown compiler probe pass: ${unknownPasses.join(', ')}`);
  if (new Set(options.passes || []).size !== (options.passes || []).length) throw new Error('compiler probe passes must be unique');
  const selectedPasses = options.passes && options.passes.length
    ? PASSES.filter(([name]) => options.passes.includes(name))
    : PASSES;
  const identity = {
    schemaVersion: 2,
    targetId: target.targetId,
    sourceText,
    compilerSha256: sha256File(compiler),
    acceptanceCompiler: !researchCompiler,
    passes: selectedPasses.map(([name]) => name),
  };
  const probeId = digest(identity);
  const directory = path.join(MATCHING_ROOT, 'targets', target.symbol, 'probes', probeId);
  fs.mkdirSync(directory, { recursive: true });
  const sourceFile = path.join(directory, `${target.symbol}.c`);
  const assemblyFile = path.join(directory, `${target.symbol}.s`);
  const reportFile = path.join(directory, 'probe-report.json');
  if (fs.existsSync(reportFile)) {
    const existing = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    if (canonicalJson(existing.identity) !== canonicalJson(identity)) throw new Error(`compiler probe digest collision: ${probeId}`);
    if (existing.status === 'complete') return { ...existing, cached: true };
  }
  if (fs.existsSync(sourceFile) && fs.readFileSync(sourceFile, 'utf8') !== sourceText) {
    throw new Error(`compiler probe source identity conflict: ${sourceFile}`);
  }
  fs.writeFileSync(sourceFile, sourceText, 'utf8');
  const args = [
    ...context.phase8.config.compiler.compileFlags,
    ...selectedPasses.map(([, flag]) => flag),
    '-o', assemblyFile,
    sourceFile,
  ];
  const started = Date.now();
  const result = childProcess.spawnSync(compiler, args, {
    cwd: directory,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024,
  });
  const files = fs.readdirSync(directory)
    .filter((name) => name !== path.basename(sourceFile) && name !== path.basename(assemblyFile) && name !== 'probe-report.json')
    .map((name) => ({ name, path: path.relative(ROOT, path.join(directory, name)).replace(/\\/g, '/'), sha256: sha256File(path.join(directory, name)), bytes: fs.statSync(path.join(directory, name)).size }));
  const report = {
    schemaVersion: 1,
    probeId,
    identity,
    target: { symbol: target.symbol, targetId: target.targetId },
    compiler: { path: compiler, sha256: sha256File(compiler), acceptanceCompiler: !researchCompiler },
    acceptanceEligible: false,
    acceptanceBoundary: researchCompiler
      ? 'Instrumented/research compiler output is explanatory only and cannot enter matching verification.'
      : 'Compiler dumps are research artifacts; the ordinary linked target and full-ROM verifiers remain required.',
    passes: selectedPasses.map(([name, flag, suffix]) => ({ name, flag, suffix })),
    commandArguments: args,
    status: result.status === 0 ? 'complete' : 'failed',
    stdout: String(result.stdout || ''),
    stderr: String(result.stderr || ''),
    durationMs: Date.now() - started,
    source: path.relative(ROOT, sourceFile).replace(/\\/g, '/'),
    assembly: fs.existsSync(assemblyFile) ? path.relative(ROOT, assemblyFile).replace(/\\/g, '/') : null,
    dumps: files,
  };
  writeJson(reportFile, report);
  return report;
}

function normalizedDump(text) {
  return text.replace(/\\/g, '/').replace(/[A-Za-z]:\/[^\s:)]+/g, '<path>').replace(/\r\n/g, '\n');
}

function compareProbes(leftReportFile, rightReportFile) {
  const leftFile = path.resolve(leftReportFile);
  const rightFile = path.resolve(rightReportFile);
  const left = JSON.parse(fs.readFileSync(leftFile, 'utf8'));
  const right = JSON.parse(fs.readFileSync(rightFile, 'utf8'));
  const leftRoot = path.dirname(leftFile);
  const rightRoot = path.dirname(rightFile);
  const comparisons = [];
  for (const [name, , suffix] of PASSES) {
    const leftDump = left.dumps.find((dump) => dump.name.endsWith(suffix));
    const rightDump = right.dumps.find((dump) => dump.name.endsWith(suffix));
    if (!leftDump && !rightDump) continue;
    if (!leftDump || !rightDump) {
      comparisons.push({
        pass: name,
        equal: false,
        left: leftDump?.name || null,
        right: rightDump?.name || null,
        reason: 'dump missing from one probe',
      });
      continue;
    }
    const leftText = normalizedDump(fs.readFileSync(path.join(leftRoot, path.basename(leftDump.name)), 'utf8'));
    const rightText = normalizedDump(fs.readFileSync(path.join(rightRoot, path.basename(rightDump.name)), 'utf8'));
    comparisons.push({ pass: name, equal: leftText === rightText, left: leftDump.name, right: rightDump.name });
  }
  return {
    schemaVersion: 1,
    left: left.probeId,
    right: right.probeId,
    firstDivergentPass: comparisons.find((item) => !item.equal)?.pass || null,
    comparisons,
  };
}

module.exports = { PASSES, compareProbes, runProbe };
