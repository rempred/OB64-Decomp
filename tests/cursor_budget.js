'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const MAX_WORDS = 500;
const CURSORS = path.resolve(__dirname, '../docs/Plans/cursors');

function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

function inspectCursor(text, name, maximum = MAX_WORDS) {
  const words = countWords(text);
  return { name, words, maximum, pass: words > 0 && words <= maximum };
}

function checkCursors(directory = CURSORS) {
  if (!fs.existsSync(directory)) return [];
  const directoryStat = fs.lstatSync(directory);
  if (directoryStat.isSymbolicLink() || !directoryStat.isDirectory()) {
    throw new Error('cursor directory must be a regular repository directory');
  }
  return fs.readdirSync(directory).filter(name => name.endsWith('.md')).sort().map(name => {
    const file = path.join(directory, name);
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`cursor is not a regular file: ${name}`);
    const bytes = fs.readFileSync(file);
    const text = bytes.toString('utf8');
    if (!Buffer.from(text, 'utf8').equals(bytes)) throw new Error(`cursor is not UTF-8: ${name}`);
    return inspectCursor(text, name);
  });
}

function run() {
  assert(inspectCursor('word '.repeat(500), 'boundary.md').pass);
  assert(!inspectCursor('word '.repeat(501), 'oversized.md').pass);
  assert(!inspectCursor(' \r\n\t', 'empty.md').pass);
  assert.equal(countWords('Résumé\r\n候補\tnext\u00a0experiment'), 4);
  const rows = checkCursors();
  const failures = rows.filter(row => !row.pass);
  if (failures.length) {
    throw new Error(failures.map(row => `${row.name}: ${row.words} words; require 1..${row.maximum}. `
      + 'Keep the next action and link to existing detail; do not truncate the assignment.').join('\n'));
  }
  console.log(`Live cursor budget: PASS (${rows.length} files; maximum ${MAX_WORDS} words)`);
  return rows;
}

if (require.main === module) {
  try { run(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { MAX_WORDS, countWords, inspectCursor, checkCursors, run };
