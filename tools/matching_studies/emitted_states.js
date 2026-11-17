#!/usr/bin/env node
'use strict';

// Read retained private diagnostics only. This command never compiles or accepts C.
const fs = require('fs');
const path = require('path');
const { elfSectionBytes, parseElf32BigEndian, sha256Buffer } = require('../lib/phase7_conventional');
const { rawRelocationRecords } = require('../lib/phase8_matching_c');
const { plain } = require('../lib/scratch_retention');
const { canonicalEmittedState } = require('./allocator_owner_order');

const REPOSITORY_ROOT = path.resolve(__dirname, '../..');

function confinedFile(file, root) {
  const relative = path.relative(root, file);
  if (!relative || path.isAbsolute(relative) || relative.split(path.sep).includes('..')) {
    throw new Error('artifact escapes selected report root');
  }
  plain(file, 'file');
  return fs.readFileSync(file);
}

function readJson(file, root) {
  return JSON.parse(confinedFile(file, root).toString('utf8').replace(/^\uFEFF/, ''));
}

function orderedRelocations(records) {
  if (!Array.isArray(records)) throw new Error('relocation records are missing');
  return records.map(record => {
    if (!record || typeof record.offset !== 'string' || !/^0x[0-9a-f]+$/i.test(record.offset)
        || typeof record.type !== 'string' || typeof record.symbol !== 'string') {
      throw new Error('malformed relocation record');
    }
    return { offset: Number.parseInt(record.offset, 16), type: record.type, symbol: record.symbol };
  });
}

function inspectReport(reportFile, root) {
  const report = readJson(reportFile, root);
  if (report.status === 'failed') return { excluded: 'report-status', status: report.status };
  if (report.status !== 'compiled') throw new Error('report status is missing or unsupported');
  if (typeof report.candidateId !== 'string' || !report.candidateId) throw new Error('candidate identity is missing');
  if (typeof report.artifactDir !== 'string' || !report.artifactDir) throw new Error('artifact directory is missing');
  const artifact = path.resolve(REPOSITORY_ROOT, report.artifactDir);
  const objectBytes = confinedFile(path.join(artifact, 'candidate.o'), root);
  const details = readJson(path.join(artifact, 'workbench-report.json'), root);
  if (!details.target || typeof details.target.symbol !== 'string' || !details.target.symbol
      || details.candidate?.candidateId !== report.candidateId) {
    throw new Error('workbench target or candidate identity differs');
  }
  const elf = parseElf32BigEndian(objectBytes);
  const sections = elf.sections.filter(section => (section.flags & 4) && section.size > 0);
  if (sections.length !== 1) throw new Error('expected exactly one nonempty executable section');
  const section = sections[0];
  if (section.type !== 1) throw new Error('executable section is not PROGBITS');
  const objectRelocations = rawRelocationRecords(elf)
    .filter(record => record.section === '.rel' + section.name)
    .map(record => ({
      ...record,
      // The retained object renames .text to its owner section. The workbench
      // reports the original section symbol for internal jumps.
      symbol: record.symbolType === 3 && record.symbolValue === 0
        ? (record.symbolSectionIndex === section.index ? '.text' : elf.sections[record.symbolSectionIndex]?.name)
        : record.symbol,
    }));
  const actual = orderedRelocations(objectRelocations);
  const declared = orderedRelocations(report.actualRelocations);
  if (JSON.stringify(actual) !== JSON.stringify(declared)) throw new Error('report relocations differ from object');
  const state = canonicalEmittedState(elfSectionBytes(elf, section), actual);
  const orderedRelocationSha256 = sha256Buffer(Buffer.from(JSON.stringify(actual)));
  const emittedStateSha256 = sha256Buffer(Buffer.from(JSON.stringify({
    objectTextSha256: state.objectTextSha256,
    orderedRelocationSha256,
  })));
  const milliseconds = report.timings?.childProcessElapsedMs;
  return {
    target: details.target.symbol,
    inputSetId: report.inputSetId || null,
    sourceClass: report.sourceClass || null,
    candidateId: report.candidateId,
    objectSha256: sha256Buffer(objectBytes),
    executableBytes: section.size,
    emittedStateSha256,
    objectTextSha256: state.objectTextSha256,
    orderedRelocationSha256,
    relocationCount: actual.length,
    childProcessMilliseconds: Number.isFinite(milliseconds) && milliseconds >= 0 ? milliseconds : null,
  };
}

function census(options) {
  const root = path.resolve(options.root);
  const { first, last } = options;
  const prefix = options.prefix || 'direct';
  if (!Number.isSafeInteger(first) || first < 1 || !Number.isSafeInteger(last)
      || last < first || last - first >= 100000 || !/^[a-z0-9_-]+$/i.test(prefix)) {
    throw new Error('use a bounded positive numbered range and a simple filename prefix');
  }
  plain(root, 'directory');
  const observations = [];
  const exclusions = [];
  const groups = new Map();
  let reportsFound = 0;
  for (let number = first; number <= last; number += 1) {
    const name = `${prefix}-${String(number).padStart(2, '0')}.json`;
    const file = path.join(root, name);
    try {
      fs.lstatSync(file);
      reportsFound += 1;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      exclusions.push({ report: name, reason: 'missing-report' });
      continue;
    }
    try {
      const observation = inspectReport(file, root);
      if (observation.excluded) {
        exclusions.push({ report: name, reason: observation.excluded, status: observation.status });
        continue;
      }
      const key = JSON.stringify([observation.target, observation.inputSetId, observation.sourceClass, observation.emittedStateSha256]);
      const group = groups.get(key) || [];
      observations.push({ report: name, ...observation, sameStateAs: group[0]?.report || null });
      group.push(observations[observations.length - 1]);
      groups.set(key, group);
    } catch (error) {
      exclusions.push({ report: name, reason: 'unreadable-or-unsupported-artifact', detail: error.message });
    }
  }
  const repeats = observations.filter(row => row.sameStateAs);
  const timed = observations.filter(row => row.childProcessMilliseconds !== null);
  return {
    generator: 'tools/matching_studies/emitted_states.js',
    schemaVersion: 1,
    boundary: 'Retained private diagnostic objects only. Equality covers executable bytes and relocation offset/type/symbol in original table order, grouped by target, input set and source class. Controls remain included. This is not matching acceptance, semantic equivalence, wasted-work accounting or a complete attempt history.',
    selection: { root, prefix, first, last, requestedReports: last - first + 1 },
    counts: {
      reportsFound,
      includedObjects: observations.length,
      excludedReports: exclusions.length,
      distinctEmittedStates: groups.size,
      repeatObservations: repeats.length,
      repeatFraction: observations.length ? repeats.length / observations.length : null,
    },
    timings: {
      unit: 'milliseconds',
      meaning: 'Sum of recorded child process durations, excluding missing timing values. Overlap, reasoning, consultation and service waits are not measured.',
      includedTimedObjects: timed.length,
      summedChildProcess: timed.reduce((sum, row) => sum + row.childProcessMilliseconds, 0),
      repeatedTimedObjects: repeats.filter(row => row.childProcessMilliseconds !== null).length,
      summedRepeatedChildProcess: repeats.reduce((sum, row) => sum + (row.childProcessMilliseconds || 0), 0),
    },
    sameStateGroups: [...groups.values()].filter(group => group.length > 1).map(group => group.map(row => row.report)),
    exclusions,
    observations,
  };
}

function parseArguments(argv) {
  const options = { first: 1, prefix: 'direct' };
  const seen = new Set();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    if (!['--root', '--first', '--last', '--prefix'].includes(flag) || argv[index + 1] === undefined) {
      throw new Error('usage: node tools/matching_studies/emitted_states.js --root <report-folder> --first 1 --last <number> [--prefix direct]');
    }
    const key = flag.slice(2);
    if (seen.has(key)) throw new Error(`repeated option ${flag}`);
    seen.add(key);
    options[key] = ['first', 'last'].includes(key) ? Number(argv[index + 1]) : argv[index + 1];
  }
  if (!options.root || options.last === undefined) throw new Error('--root and --last are required');
  return options;
}

if (require.main === module) {
  try {
    const report = census(parseArguments(process.argv.slice(2)));
    console.log(JSON.stringify(report, null, 2));
    if (report.exclusions.some(row => row.reason !== 'report-status')) process.exitCode = 1;
  } catch (error) {
    console.error(`emitted-state census failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { census, inspectReport, orderedRelocations, parseArguments };
