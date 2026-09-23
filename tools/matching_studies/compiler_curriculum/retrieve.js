#!/usr/bin/env node
'use strict';

const fs = require('fs');
const {retrieve} = require('./corpus');

function main(args = process.argv.slice(2)) {
  const [trainingFile, queriesFile, symbol] = args;
  if (args.length !== 3) throw new Error('Usage: retrieve.js training.jsonl evaluation-queries.jsonl symbol');
  const read = file => fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(line => line.trim()).map(line => JSON.parse(line));
  const queries = read(queriesFile).filter(query => query.symbol.toLowerCase() === symbol.toLowerCase());
  if (queries.length !== 1) throw new Error('Query is missing or ambiguous');
  const result = retrieve(queries[0], read(trainingFile), {heldOut: true});
  process.stdout.write(JSON.stringify({query: symbol, mode: 'held-out-family', candidates: result}, null, 2) + '\n');
}
if (require.main === module) main();
