#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ROOT, ensureDir } = require('./lib/rom');
const { buildConfig, sha256Text } = require('./lib/overlay_config');

function parseArgs(argv) {
  const args = {
    rom: path.join(ROOT, 'build', 'baserom.us_rev0.z64'),
    manifest: path.join(ROOT, 'asm', 'original', 'rev0', 'manifest.json'),
    output: path.join(ROOT, 'config', 'overlays', 'us_rev0.json'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--rom') args.rom = path.resolve(argv[++i]);
    else if (arg === '--manifest') args.manifest = path.resolve(argv[++i]);
    else if (arg === '--output') args.output = path.resolve(argv[++i]);
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node tools/generate_overlay_config.js [--rom <canonical.z64>] [--manifest <manifest.json>] [--output <config.json>]');
      process.exit(0);
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { config, text } = buildConfig({ romPath: args.rom, manifestPath: args.manifest });
  ensureDir(path.dirname(args.output));
  fs.writeFileSync(args.output, text);
  console.log(`Overlay config generated: ${args.output}`);
  console.log(`Descriptors: ${config.descriptors.length}; groups: ${config.groups.length}; pointers: ${config.pointers.length}; null: ${config.nullWord.value}`);
  console.log(`SHA256: ${sha256Text(text)}`);
}

main();
