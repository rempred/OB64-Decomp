#!/usr/bin/env node
'use strict';

const {
  ensureCurrentBuild,
  prepareContext,
} = require('./lib/current_workflow');

function main() {
  console.log('OB64 Decomp Build');
  console.log('');
  const context = prepareContext();
  const result = ensureCurrentBuild(context, { onStep: (message) => console.log(`${message}...`) });
  console.log('');
  console.log(`CURRENT ................... ${result.reused ? 'READY' : 'BUILT'}`);
  console.log(`Complete ROM .............. EXACT`);
  console.log(`SHA-256 ................... ${result.rom.sha256}`);
  console.log(`Output .................... ${result.output}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Build failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { main };
