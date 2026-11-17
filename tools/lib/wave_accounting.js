'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const retention = require('./scratch_retention');

const ACTIVITY_KINDS = new Set(['matching', 'tooling-wait', 'coordination-wait', 'service-wait', 'integration', 'acceptance']);

function fail(message) { throw new Error(`wave accounting: ${message}`); }

function readJson(file) {
  const before = retention.plain(file, 'file');
  const bytes = fs.readFileSync(file);
  const after = retention.plain(file, 'file');
  if (before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ino !== after.ino) fail(`input changed: ${file}`);
  return { value: JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')),
    path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase() };
}

function absolute(value, label) {
  if (typeof value !== 'string' || !path.isAbsolute(value)) fail(`${label} requires an absolute path`);
  return path.resolve(value);
}

function interval(value, label) {
  const timestamp = text => typeof text === 'string' && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(text) && Number.isFinite(Date.parse(text));
  if (!value || !timestamp(value.startedAt) || !timestamp(value.finishedAt)) fail(`${label} requires start/end timestamps with timezones`);
  const start = Date.parse(value.startedAt), end = Date.parse(value.finishedAt);
  if (end <= start) fail(`${label} has a reversed or empty interval`);
  return { start, end };
}

function workerName(value) {
  if (typeof value !== 'string' || !value.trim()) fail('each time record requires a worker');
  return value;
}

function clip(record, window) {
  const start = Math.max(record.start, window.start), end = Math.min(record.end, window.end);
  return end > start ? { ...record, start, end } : null;
}

function coverage(records, window) {
  const points = [...new Set([window.start, window.end, ...records.flatMap(record => [record.start, record.end])])].sort((a, b) => a - b);
  const byKindMs = {}, exclusiveByKindMs = {};
  let observedMs = 0, simultaneousMs = 0, ambiguousActivityMs = 0;
  for (let index = 1; index < points.length; index++) {
    const start = points[index - 1], end = points[index], duration = end - start;
    const active = records.filter(record => record.start < end && record.end > start);
    const kinds = [...new Set(active.map(record => record.kind))];
    if (!active.length) continue;
    observedMs += duration;
    if (active.length > 1) simultaneousMs += duration;
    const activities = active.filter(record => record.kind !== 'tool-command');
    if (new Set(activities.map(record => record.worker)).size < activities.length) ambiguousActivityMs += duration;
    for (const kind of kinds) byKindMs[kind] = (byKindMs[kind] || 0) + duration;
    if (kinds.length === 1) exclusiveByKindMs[kinds[0]] = (exclusiveByKindMs[kinds[0]] || 0) + duration;
  }
  return { observedMs, unobservedMs: window.end - window.start - observedMs,
    simultaneousMs, ambiguousActivityMs, byKindMs, exclusiveByKindMs };
}

function storageRoots(roots, references, issues) {
  const seen = [];
  return roots.map(root => {
    root = absolute(root, 'diff root');
    const key = root.toLowerCase();
    if (seen.some(previous => previous === key || key.startsWith(previous + path.sep) || previous.startsWith(key + path.sep))) fail('diff roots overlap');
    seen.push(key);
    try {
      const inventory = retention.inventory(root, references);
      // Omitted reference categories are explicit limitations of this read-only
      // measurement. A supplied input that cannot be inspected is an error.
      const inputIssues = inventory.issues.filter(issue => !/^missing (docs|memory|mail) reference input$/.test(issue));
      issues.push(...inputIssues);
      const runs = inventory.runs.map(run => {
        const complete = Number.isSafeInteger(run.bytes) && Number.isSafeInteger(run.retainedBytes) && run.bytes >= run.retainedBytes
          && !run.protection.includes('unsafe/incomplete file census');
        const classified = complete && run.status === 'complete';
        return { ...run, byteCensusComplete: complete,
          retainedRecordBytes: classified ? run.retainedBytes : null,
          otherRunBytes: classified ? run.bytes - run.retainedBytes : null,
          classification: classified ? 'retained records and other run files' : 'unclassified; preserve entire run' };
      });
      const complete = runs.every(run => run.byteCensusComplete);
      return { root, byteCensusComplete: complete,
        measuredBytes: runs.reduce((sum, run) => sum + (run.bytes || 0), 0),
        retainedRecordBytes: runs.reduce((sum, run) => sum + (run.retainedRecordBytes || 0), 0),
        otherRunBytes: runs.reduce((sum, run) => sum + (run.otherRunBytes || 0), 0),
        unclassifiedMeasuredBytes: runs.filter(run => run.retainedRecordBytes === null).reduce((sum, run) => sum + (run.bytes || 0), 0),
        unknownRunCount: runs.filter(run => !run.byteCensusComplete).length,
        suppliedReferenceInputsComplete: inputIssues.length === 0,
        referenceInventoryComplete: inventory.referenceInventoryComplete,
        warnings: inventory.warnings, issues: inventory.issues, runs };
    } catch (error) {
      issues.push(error.message);
      return { root, byteCensusComplete: false, measuredBytes: 0, unknownRunCount: null, issues: [error.message], runs: [] };
    }
  });
}

function report(manifest) {
  if (!manifest || manifest.schemaVersion !== 1 || typeof manifest.wave !== 'string' || !manifest.wave.trim()) fail('manifest requires schemaVersion 1 and a wave name');
  for (const field of ['workers', 'profiles', 'diagnostics', 'activities', 'diffRoots']) {
    if (manifest[field] !== undefined && !Array.isArray(manifest[field])) fail(`${field} must be an array`);
  }
  for (const [category, roots] of Object.entries(manifest.references || {})) {
    if (!['docs', 'memory', 'mail'].includes(category) || !Array.isArray(roots)) fail('reference inputs require docs/memory/mail arrays');
    for (const root of roots) absolute(root, 'reference input');
  }
  const window = interval(manifest.window, 'wave window'), issues = [], records = [], profiles = [], seenProfiles = new Set();
  const declaredWorkers = new Set((manifest.workers || []).map(workerName));
  for (const entry of manifest.profiles || []) {
    const file = absolute(entry.path, 'profile'), worker = workerName(entry.worker);
    declaredWorkers.add(worker);
    if (seenProfiles.has(file.toLowerCase())) fail(`duplicate profile: ${file}`);
    seenProfiles.add(file.toLowerCase());
    try {
      const input = readJson(file), value = input.value;
      if (value.schemaVersion !== 1 || !Array.isArray(value.stages) || !Array.isArray(value.childProcesses)
          || !Number.isFinite(value.totalMs) || value.totalMs < 0
          || !Number.isFinite(value.childProcessMs) || value.childProcessMs < 0) fail(`invalid timing profile: ${file}`);
      const timing = interval(value, 'timing profile');
      const selected = clip({ ...timing, worker, kind: 'tool-command', evidence: file }, window);
      if (selected) records.push(selected);
      const elapsedMs = timing.end - timing.start;
      profiles.push({ path: file, sha256: input.sha256, worker, status: value.status,
        totalMs: value.totalMs, childProcessMs: value.childProcessMs, calendarMs: elapsedMs,
        clockDifferenceMs: elapsedMs - value.totalMs,
        selectedCalendarMs: selected ? selected.end - selected.start : 0,
        selectedCompletely: Boolean(selected && selected.start === timing.start && selected.end === timing.end) });
    } catch (error) { issues.push(error.message); }
  }
  for (const activity of manifest.activities || []) {
    if (!ACTIVITY_KINDS.has(activity.kind) || typeof activity.evidence !== 'string' || !activity.evidence.trim()) fail('activity requires a supported kind and an evidence reference');
    const selected = clip({ ...interval(activity, 'activity'), worker: workerName(activity.worker),
      kind: activity.kind, evidence: activity.evidence }, window);
    declaredWorkers.add(activity.worker);
    if (selected) records.push(selected);
  }
  const diagnostics = [];
  for (const entry of manifest.diagnostics || []) {
    const file = absolute(entry.path, 'diagnostic'), worker = workerName(entry.worker);
    declaredWorkers.add(worker);
    if (seenProfiles.has(file.toLowerCase())) fail(`duplicate timing input: ${file}`);
    seenProfiles.add(file.toLowerCase());
    try {
      const input = readJson(file), timings = input.value.timings;
      if (!timings || !Number.isFinite(timings.childProcessElapsedMs) || timings.childProcessElapsedMs < 0
          || ['nativeCompilerMs', 'nativeAssemblerMs'].some(key => timings[key] !== undefined
            && (!Number.isFinite(timings[key]) || timings[key] < 0))) fail(`invalid candidate diagnostic timing: ${file}`);
      diagnostics.push({ path: file, sha256: input.sha256, worker, childProcessElapsedMs: timings.childProcessElapsedMs,
        nativeCompilerMs: timings.nativeCompilerMs ?? null, nativeAssemblerMs: timings.nativeAssemblerMs ?? null });
    } catch (error) { issues.push(error.message); }
  }
  const workers = [...declaredWorkers].sort();
  const byWorker = workers.map(worker => ({ worker, ...coverage(records.filter(record => record.worker === worker), window) }));
  const storage = storageRoots(manifest.diffRoots || [], manifest.references || {}, issues);
  return { schemaVersion: 1, wave: manifest.wave, mode: 'read-only', deletionEnabled: false, quotaEnforced: false,
    window: manifest.window, wallMs: window.end - window.start,
    inputIssues: issues, inputsComplete: issues.length === 0,
    storage: { measuredAt: new Date().toISOString(), selectedRootCount: storage.length, roots: storage,
      byteCensusComplete: storage.every(root => root.byteCensusComplete),
      referenceInventoryComplete: storage.length ? storage.every(root => root.referenceInventoryComplete) : null,
      measuredBytes: storage.reduce((sum, root) => sum + root.measuredBytes, 0),
      limits: 'Selected roots only. References are inspected only for selected storage roots. Input completeness covers consumed inputs and byte census. Omitted reference categories leave reference inventory incomplete. Live filesystem measurement is not an atomic snapshot. Other run files can contain required dependency evidence. All runs remain protected; byte classes never authorize deletion.' },
    timing: { byWorker, calendarCoverage: coverage(records, window), profiles, diagnostics,
      diagnosticSums: { count: diagnostics.length,
        childProcessElapsedMs: diagnostics.reduce((sum, entry) => sum + entry.childProcessElapsedMs, 0),
        measuredNativeCompilerMs: diagnostics.reduce((sum, entry) => sum + (entry.nativeCompilerMs || 0), 0),
        measuredNativeAssemblerMs: diagnostics.reduce((sum, entry) => sum + (entry.nativeAssemblerMs || 0), 0),
        nativeCompilerMeasurements: diagnostics.filter(entry => entry.nativeCompilerMs !== null).length,
        nativeAssemblerMeasurements: diagnostics.filter(entry => entry.nativeAssemblerMs !== null).length },
      limits: 'Calendar intervals are unioned. Profile command and child durations are measured sums, not exclusive worker time. Candidate diagnostic durations have no calendar placement and do not reduce unobserved time. Nested duration fields are never added together. Unobserved time has no inferred cause. Activity labels are supplied observations and require their cited evidence.' } };
}

module.exports = { ACTIVITY_KINDS, readJson, coverage, report };
