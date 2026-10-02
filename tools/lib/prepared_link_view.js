'use strict';

// Invocation-local preparation only. No path-keyed cache or cached verdicts.
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const { parseElfFile, parseElf32BigEndian, sha256Buffer } = require('./phase7_conventional');
const maps = new WeakMap(), contexts = new WeakMap();
function fail(message) { throw new Error('prepared link view: ' + message); }
function prepareMap(text) {
  if (typeof text !== 'string') fail('map text is missing');
  const lines = Object.freeze(text.split(/\r?\n/)), headings = new Map();
  const strict = [], loose = [], any = [];
  lines.forEach((line, index) => {
    const match = /^(\S+)\s/.exec(line);
    if (match) { if (!headings.has(match[1])) headings.set(match[1], []); headings.get(match[1]).push(index); }
    if (/^\.ob64\.r\d{4}(?:\.s\d+)?\s/.test(line)) strict.push(index);
    if (/^\.ob64\.r\d/.test(line)) loose.push(index);
    if (/^\S/.test(line)) any.push(index);
  });
  const ends = indices => {
    const result = new Array(lines.length); let next = lines.length, cursor = indices.length - 1;
    for (let i = lines.length - 1; i >= 0; i--) {
      result[i] = next;
      if (indices[cursor] === i) { next = i; cursor--; }
    }
    return result;
  };
  const view = Object.freeze({});
  maps.set(view, { lines, headings, ends: { strict: ends(strict), loose: ends(loose), any: ends(any) } });
  return view;
}
function mapBlock(view, name, mode = 'strict', spaceOnly = false, unique = false) {
  if (typeof view === 'string') view = prepareMap(view);
  const state = maps.get(view);
  if (!state || !state.ends[mode]) fail('invalid map view/boundary');
  const starts = state.headings.get(name) || [];
  if (unique && starts.length > 1) fail('duplicate map section header: ' + name);
  // Legacy consumers differ: most select the first match, while BSS requires
  // exactly one header. Literal-space consumers skip earlier tab-only matches.
  const start = spaceOnly ? starts.find(index => state.lines[index].startsWith(name + ' ')) : starts[0];
  if (start === undefined) return null;
  return state.lines.slice(start, state.ends[mode][start]);
}
function freezeMetadata(value) {
  if (!value || typeof value !== 'object' || Buffer.isBuffer(value)) return value;
  for (const child of Object.values(value)) freezeMetadata(child);
  return Object.isFrozen(value) ? value : Object.freeze(value);
}
function linkContext(root, canonicalBaserom, parsedElf = null) {
  const elfFile = path.resolve(root, 'phase8.elf'), mapFile = path.resolve(root, 'phase8.map');
  const elf = parsedElf || parseElfFile(elfFile), mapBytes = fs.readFileSync(mapFile);
  const elfSha256 = sha256Buffer(elf.buffer), mapSha256 = sha256Buffer(mapBytes);
  // When accepting an already parsed object, authenticate its exact backing bytes.
  if (parsedElf && sha256Buffer(fs.readFileSync(elfFile)) !== elfSha256) fail('parsed ELF differs from disk');
  if (parsedElf && !isDeepStrictEqual(parsedElf, parseElf32BigEndian(parsedElf.buffer))) fail('parsed ELF metadata differs from backing bytes');
  freezeMetadata(elf);
  const mapText = mapBytes.toString('utf8');
  const context = Object.freeze({ canonicalBaserom, elf, mapText, mapView: prepareMap(mapText), elfSha256, mapSha256 });
  contexts.set(context, { elfFile, mapFile, active: true });
  return context;
}
function assertContext(context, root) {
  const state = contexts.get(context);
  if (!state || !state.active || state.elfFile !== path.resolve(root, 'phase8.elf')) fail('inactive or foreign context');
  return context;
}
function finishLinkContext(context) {
  const state = contexts.get(context);
  if (!state || !state.active) fail('inactive context');
  state.active = false;
  if (sha256Buffer(context.elf.buffer) !== context.elfSha256
      || sha256Buffer(fs.readFileSync(state.elfFile)) !== context.elfSha256
      || sha256Buffer(fs.readFileSync(state.mapFile)) !== context.mapSha256) fail('ELF/map changed during verification');
}
module.exports = { prepareMap, mapBlock, linkContext, assertContext, finishLinkContext };
