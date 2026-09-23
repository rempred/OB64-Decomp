'use strict';

// Retrieval evidence, not a proof that two functions have the same semantics.
const crypto = require('crypto');
const {
  instructionInfo, opcodeKey, structuralRepresentation, wordsFromBuffer,
} = require('../../lib/matching/mips_analysis');

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function bytes(hex) {
  if (typeof hex !== 'string' || !/^(?:[0-9a-f]{8})+$/i.test(hex)) {
    throw new Error('Instruction bytes must be nonempty, aligned hexadecimal text');
  }
  return Buffer.from(hex, 'hex');
}

function features(hex, start = 0) {
  const text = bytes(hex);
  const instructions = wordsFromBuffer(text).map((word, i) => instructionInfo(word, start + i * 4));
  const opcodes = instructions.map(opcodeKey);
  const grams = {};
  for (let width = 1; width <= 3; width++) {
    for (let i = 0; i + width <= opcodes.length; i++) {
      const gram = opcodes.slice(i, i + width).join('/');
      grams[gram] = (grams[gram] || 0) + 1;
    }
  }
  const calls = instructions.filter(value => value.call).length;
  const branches = instructions.filter(value => value.conditional).length;
  return {
    instructionCount: instructions.length, calls, branches, grams,
    family: hash(structuralRepresentation(text, start)),
    stage: calls ? 'calls-and-context' : branches ? 'control-flow' : 'straight-line',
  };
}

function similarity(a, b) {
  let overlap = 0;
  const countA = Object.values(a.grams).reduce((sum, n) => sum + n, 0);
  const countB = Object.values(b.grams).reduce((sum, n) => sum + n, 0);
  for (const [gram, count] of Object.entries(a.grams)) overlap += Math.min(count, b.grams[gram] || 0);
  return 2 * overlap / (countA + countB);
}

function normalizedSourceHash(source) {
  // Conservative additional duplicate key. Family and object keys also group aliases.
  return hash(source.replace(/\r\n/g, '\n').trim());
}

function validateRecord(row) {
  if (!row || typeof row.symbol !== 'string' || !row.symbol || row.sourceClass !== 'PURE_C'
      || typeof row.sourceText !== 'string' || !row.sourceText.trim()
      || typeof row.toolId !== 'string' || !row.toolId || !Array.isArray(row.relocations)
      || !Number.isInteger(row.vramStart) || row.vramStart < 0 || row.vramStart > 0xffffffff) {
    throw new Error('Malformed or non-PURE_C curriculum record');
  }
  if (row.sourceSha256 !== hash(row.sourceText) || row.objectSha256 !== hash(bytes(row.objectHex))
      || row.retailSha256 !== hash(bytes(row.retailHex))) {
    throw new Error('Curriculum content identity mismatch');
  }
  const assembly = row.provenance?.assemblyProvenance?.compilerAssembly;
  if (typeof row.compilerAssembly !== 'string' || !assembly
      || typeof assembly.sha256 !== 'string' || assembly.sha256.toLowerCase() !== hash(row.compilerAssembly)
      || assembly.bytes !== Buffer.byteLength(row.compilerAssembly, 'utf8')) {
    throw new Error('Compiler assembly identity mismatch');
  }
  if (row.aliases !== undefined && (!Array.isArray(row.aliases) || row.aliases.some(x => typeof x !== 'string'))) {
    throw new Error('Malformed aliases');
  }
  return row;
}

function keys(row) {
  return [
    ...[row.symbol, ...(row.aliases || [])].map(x => `symbol:${x.toLowerCase()}`),
    `source:${normalizedSourceHash(row.sourceText)}`,
    `object:${row.objectSha256}`, `retail:${row.retailSha256}`,
    `family:${features(row.retailHex, row.vramStart).family}`,
  ];
}

function partition(records, foldCount = 5) {
  if (!Number.isInteger(foldCount) || foldCount < 2 || foldCount > 100) throw new Error('Invalid fold count');
  const rows = records.map(validateRecord);
  if (new Set(rows.map(row => row.toolId)).size > 1) throw new Error('Do not mix compiler identities in one curriculum');
  if (new Set(rows.map(row => row.symbol.toLowerCase())).size !== rows.length) throw new Error('Duplicate target in curriculum');
  const parent = rows.map((_, i) => i);
  function root(i) { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; }
  const owners = new Map();
  rows.forEach((row, i) => {
    for (const key of keys(row)) {
      if (owners.has(key)) parent[root(i)] = root(owners.get(key));
      else owners.set(key, i);
    }
  });
  const groups = new Map();
  rows.forEach((row, i) => {
    const key = root(i);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  });
  const result = [];
  for (const group of groups.values()) {
    const groupId = hash([...new Set(group.flatMap(keys))].sort().join('\n'));
    const fold = Number.parseInt(groupId.slice(0, 8), 16) % foldCount;
    for (const row of group) result.push({...row, groupId, fold});
  }
  return result.sort((a, b) => a.symbol.localeCompare(b.symbol));
}

function queryFromRecord(row) {
  validateRecord(row);
  return {
    symbol: row.symbol, aliases: row.aliases || [], toolId: row.toolId,
    retailHex: row.retailHex, vramStart: row.vramStart, groupId: row.groupId,
    sourceSha256: row.sourceSha256, objectSha256: row.objectSha256,
    family: features(row.retailHex, row.vramStart).family,
  };
}

function retrieve(query, records, {limit = 5, heldOut = false} = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('Invalid retrieval limit');
  if (typeof query.symbol !== 'string' || !query.toolId || !Number.isInteger(query.vramStart)) throw new Error('Malformed query');
  const target = features(query.retailHex, query.vramStart);
  const identities = new Set([query.symbol, ...(query.aliases || [])].map(x => x.toLowerCase()));
  const candidates = [];
  for (const row of records) {
    validateRecord(row);
    if (row.toolId !== query.toolId) throw new Error('Query and corpus use different compiler identities');
    if ([row.symbol, ...(row.aliases || [])].some(x => identities.has(x.toLowerCase()))) continue;
    const current = features(row.retailHex, row.vramStart);
    if (heldOut && (
      row.groupId === query.groupId && query.groupId !== undefined
      || current.family === target.family
      || row.sourceSha256 === query.sourceSha256
      || row.objectSha256 === query.objectSha256
      || row.retailSha256 === hash(bytes(query.retailHex)))) continue;
    candidates.push({symbol: row.symbol, score: similarity(target, current),
      familyEqual: target.family === current.family, sourcePath: row.sourcePath,
      sourceText: row.sourceText, compilerAssembly: row.compilerAssembly,
      sourceClass: row.sourceClass, toolId: row.toolId,
      evidence: 'retrieval-lead; not semantic equivalence or a matching-C verdict'});
  }
  return candidates.sort((a, b) => b.score - a.score || a.symbol.localeCompare(b.symbol)).slice(0, limit);
}

function evaluate(records, heldOutFold = 0) {
  if (!Number.isInteger(heldOutFold) || heldOutFold < 0 || heldOutFold > 99) throw new Error('Invalid held-out fold');
  const train = records.filter(row => row.fold !== heldOutFold);
  const test = records.filter(row => row.fold === heldOutFold);
  const trainingGroups = new Set(train.map(row => row.groupId));
  if (test.some(row => trainingGroups.has(row.groupId))) throw new Error('Family leakage between training and evaluation');
  const queries = test.map(row => {
    const ranked = retrieve(queryFromRecord(row), train, {heldOut: true});
    return {symbol: row.symbol, groupId: row.groupId,
      candidates: ranked.map(({symbol, score}) => ({symbol, score}))};
  });
  return {
    schemaVersion: 1, metric: 'retrieval availability only; no recovery rate is measured',
    trainExamples: train.length, heldOutExamples: test.length,
    families: new Set(records.map(row => row.groupId)).size,
    heldOutWithCandidates: queries.filter(row => row.candidates.length).length,
    measuredRecovery: null, queries,
  };
}

module.exports = {hash, bytes, features, similarity, validateRecord, partition, queryFromRecord, retrieve, evaluate};
