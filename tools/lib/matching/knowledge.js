'use strict';
// Read-only discovery. Similarity, source classification and research validity are
// separate from transfer applicability and canonical matching acceptance.
const fs = require('fs'), path = require('path');
const { ROOT, sha256File } = require('../phase7_conventional');
const { resolveTarget, historicalSymbols, scratchCapability } = require('./target_model');
const { regular, canonicalPath } = require('./research');
const policy = require('../source_policy');
const mips = require('./mips_analysis');

const SYMPTOMS = Object.freeze(['register-allocation', 'scheduling-or-block-order',
  'load-store-width-or-signedness', 'stack-layout-or-offset-family', 'branch-polarity',
  'constant-or-immediate-construction', 'opcode-or-expression', 'store-flag']);
const INDEX = path.join(ROOT, 'docs/matching-c/compiler-lessons.json');
const relative = file => path.relative(ROOT, file).replace(/\\/g, '/');
const TIERS = [
  ['exact', t => t.expectedBytes.toString('hex')],
  ['relocation-normalized', t => mips.relocationNormalizedRepresentation(t.expectedBytes, t.vramStart)],
  ['register-normalized', t => mips.registerNormalizedRepresentation(t.expectedBytes, t.vramStart, { ignoreExternalTargets: true })],
  ['structural', t => mips.structuralRepresentation(t.expectedBytes, t.vramStart)],
];
function validateOptions(options = {}) {
  const crossLimit = options.crossLimit ?? 0;
  if (!Number.isSafeInteger(crossLimit) || crossLimit < 0 || crossLimit > 3) throw new Error('cross-limit must be 0..3');
  if (options.symptom !== undefined && !SYMPTOMS.includes(options.symptom)) throw new Error(`unknown symptom: ${options.symptom}`);
  return { crossLimit, symptom: options.symptom };
}
function catalog(directory) {
  const records = [], diagnostics = [];
  try {
    regular(directory, true);
    for (const name of fs.readdirSync(directory).filter(n => n.endsWith('.observation.json')).sort()) {
      const file = path.join(directory, name);
      try { records.push({ origin: 'archive', metadataPath: relative(file), envelope: JSON.parse(fs.readFileSync(regular(file), 'utf8')) }); }
      catch (error) { diagnostics.push({ path: relative(file), validity: 'malformed', reason: error.message }); }
    }
  } catch (error) { diagnostics.push({ path: relative(directory), validity: 'unavailable', reason: error.message }); }
  return { records, diagnostics };
}
function sourceFor(target) { return target.activeMatchingSource || target.activeMatchingProducer?.source || null; }

// Pure selector, also usable with historically reconstructed targets/catalogs.
// Callers must supply only source availability established at their cutoff.
function selectFamilyCandidates(target, targets, records = []) {
  if (!Buffer.isBuffer(target.expectedBytes) || !target.expectedBytesSha256) return [];
  const own = new Set(historicalSymbols(target));
  const candidates = targets.filter(t => !historicalSymbols(t).some(s => own.has(s))
    && !(t.romStart === target.romStart && t.romEndExclusive === target.romEndExclusive)
    && Buffer.isBuffer(t.expectedBytes) && t.expectedBytesSha256
    && t.expectedBytes.length === target.expectedBytes.length)
    .map(t => ({ target: t, records: records.filter(r => historicalSymbols(t).includes(String(r.envelope?.symbol).toLowerCase())) }))
    .filter(c => sourceFor(c.target) || c.records.length);
  const matches = [];
  for (let tierIndex = 0; tierIndex < TIERS.length; tierIndex++) {
    const [tier, representation] = TIERS[tierIndex], expected = representation(target);
    for (const candidate of candidates) {
      if (candidate.matched || representation(candidate.target) !== expected) continue;
      candidate.matched = true;
      matches.push({ target: candidate.target, records: candidate.records, tier, tierIndex });
    }
  }
  return matches.sort((a, b) => a.tierIndex - b.tierIndex || a.target.romStart - b.target.romStart || a.target.symbol.localeCompare(b.target.symbol));
}
function keys(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(k => !allowed.includes(k))) throw new Error('unsupported lesson index fields');
}
function link(value, anchor = false) {
  if (typeof value !== 'string') throw new Error('lesson link must be a path');
  const [file, fragment, extra] = value.split('#');
  if (!canonicalPath(file) || extra !== undefined || (!anchor && fragment !== undefined)) throw new Error('invalid lesson link');
  const text = fs.readFileSync(regular(path.join(ROOT, file)), 'utf8');
  if (fragment !== undefined) {
    const headings = [...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m => m[1].trim().toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, '').replace(/\s/g, '-'));
    if (!fragment || !headings.includes(fragment)) throw new Error('lesson anchor is missing');
  }
  return value;
}
function loadLessons(file = INDEX) {
  const result = { status: 'available', lessons: [], diagnostics: [] };
  try {
    const value = JSON.parse(fs.readFileSync(regular(file), 'utf8'));
    keys(value, ['schemaVersion', 'lessons']);
    if (value.schemaVersion !== 1 || !Array.isArray(value.lessons) || value.lessons.length > 30) throw new Error('unsupported lesson index');
    const seen = new Set();
    for (const row of value.lessons) {
      keys(row, ['id', 'symptoms', 'applicability', 'note', 'references', 'observations']);
      if (typeof row.id !== 'string' || !/^[a-z0-9-]+$/.test(row.id) || seen.has(row.id)) throw new Error('invalid or duplicate lesson id');
      seen.add(row.id);
      if (!Array.isArray(row.symptoms) || !row.symptoms.length || row.symptoms.some(s => !SYMPTOMS.includes(s)) || new Set(row.symptoms).size !== row.symptoms.length) throw new Error('unknown or duplicate lesson symptom');
      if (typeof row.applicability !== 'string' || !row.applicability.trim() || row.applicability.length > 500) throw new Error('invalid lesson applicability');
      link(row.note, true);
      if (!Array.isArray(row.references) || row.references.length > 6 || !Array.isArray(row.observations) || row.observations.length > 3) throw new Error('invalid lesson references');
      row.references.forEach(p => link(p));
      for (const ref of row.observations) {
        keys(ref, ['symbol', 'path']);
        if (typeof ref.symbol !== 'string' || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(ref.symbol) || !canonicalPath(ref.path) || !ref.path.endsWith('.observation.json')) throw new Error('invalid lesson observation reference');
        // Missing/corrupt donor metadata is reported per selected record below.
      }
      result.lessons.push(row);
    }
  } catch (error) {
    result.status = 'unavailable'; result.lessons = [];
    result.diagnostics.push({ path: relative(file), validity: 'malformed', reason: error.message });
  }
  return result;
}
function applicability(workbench, receiving, donor) {
  const a = scratchCapability(workbench, receiving), b = scratchCapability(workbench, donor);
  return { status: 'reference-only', reason: !a.supported ? a.reason : !b.supported ? b.reason
    : 'Donor evidence applies to its own target only; test any source transfer independently.' };
}
function selectKnowledge(workbench, target, options, assess) {
  const { crossLimit, symptom } = validateOptions(options), start = Date.now();
  const result = { schemaVersion: 1, status: crossLimit || symptom ? 'available' : 'disabled',
    siblings: [], lessons: [], diagnostics: [], siblingsOmitted: 0, lessonsOmitted: 0,
    timings: { selectionMs: 0, authenticationMs: 0 },
    boundary: 'Source examples and authored research, never accepted proof or transfer equivalence. Cross-target relations do not alter same-target history.' };
  if (!crossLimit && !symptom) return result;
  const archive = crossLimit ? catalog(options.archiveDirectory || path.join(ROOT, 'docs/dossiers')) : { records: [], diagnostics: [] };
  result.diagnostics.push(...archive.diagnostics);
  if (crossLimit && !target.expectedBytesSha256) result.diagnostics.push({ validity: 'reference-only', reason: 'Family selection requires canonical target bytes; unavailable without the baserom.' });
  const selected = crossLimit ? selectFamilyCandidates(target, workbench.targets, archive.records) : [];
  result.siblingsOmitted = Math.max(0, selected.length - crossLimit);
  const index = symptom ? loadLessons(options.indexPath) : { lessons: [], diagnostics: [] };
  result.diagnostics.push(...index.diagnostics);
  const lessons = index.lessons.filter(l => l.symptoms.includes(symptom));
  result.lessonsOmitted = Math.max(0, lessons.length - 3);
  result.timings.selectionMs = Date.now() - start;
  const authStart = Date.now();
  function authenticate(ref) {
    try {
      const donor = resolveTarget(workbench, ref.symbol);
      const envelope = JSON.parse(fs.readFileSync(regular(path.join(ROOT, ref.path)), 'utf8'));
      return { ...assess(donor, { origin: 'archive', metadataPath: ref.path, envelope }),
        donorSymbol: donor.symbol, applicability: applicability(workbench, target, donor),
        relationsStatus: 'not-assessed; donor relation claims are not transfer proof' };
    } catch (error) { return { metadata: ref.path, donorSymbol: ref.symbol, validity: 'unavailable', reason: error.message }; }
  }
  for (const candidate of selected.slice(0, crossLimit)) {
    const donor = candidate.target, source = sourceFor(donor);
    const row = { symbol: donor.symbol, tier: candidate.tier, applicability: applicability(workbench, target, donor),
      differences: { receiverBytes: target.bytes, donorBytes: donor.bytes, receiverPlacement: target.placementKind, donorPlacement: donor.placementKind,
        receiverOverlay: target.overlayDescriptorId ?? null, donorOverlay: donor.overlayDescriptorId ?? null },
      normalizationLimit: candidate.tier === 'exact' ? 'Equal bytes still have distinct physical owners.' : candidate.tier === 'structural'
        ? 'CFG/opcode shape ignores register and immediate differences, including field offsets and constants.'
        : candidate.tier === 'register-normalized' ? 'Consistent GPR renaming and external control targets are ignored.' : 'Only external J/JAL target fields are ignored; HI/LO intent is not inferred.' };
    if (source) {
      row.kind = 'active-source-example'; row.source = source;
      try {
        const file = regular(path.join(ROOT, source)), classification = policy.classifySource(file);
        row.sourceSha256 = sha256File(file); row.sourceClass = classification.class;
        row.validity = classification.class === 'UNKNOWN' ? 'unavailable' : 'source-example';
        if (classification.error) row.reason = classification.error;
      } catch (error) { row.validity = 'unavailable'; row.reason = error.message; }
      row.acceptance = 'not-assessed';
    } else {
      row.kind = 'preserved-observation';
      // Authored historical preference chooses what to inspect, never its validity.
      // A stale preferred record stays visible; do not search past it for a pass.
      const record = candidate.records.slice().sort((a,b) => Number(b.envelope?.authored?.selectedBest===true)
        - Number(a.envelope?.authored?.selectedBest===true) || a.metadataPath.localeCompare(b.metadataPath))[0];
      row.observation = authenticate({ symbol: donor.symbol, path: record.metadataPath });
      row.selection = record.envelope?.authored?.selectedBest===true
        ? 'Historical selected-best annotation; not an active-best or acceptance claim.' : 'Deterministic metadata path order; no authored historical preference.';
      row.validity = row.observation.validity;
    }
    result.siblings.push(row);
  }
  for (const lesson of lessons.slice(0, 3)) result.lessons.push({ ...lesson,
    evidence: 'Open the cited note for its scoped evidence labels; this index supplies no independent proof.',
    observations: lesson.observations.map(authenticate) });
  result.timings.authenticationMs = Date.now() - authStart;
  if (result.diagnostics.length) result.status = 'partial';
  return result;
}
module.exports = { SYMPTOMS, INDEX, validateOptions, catalog, selectFamilyCandidates, loadLessons, selectKnowledge };
