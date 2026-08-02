#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
function value(flag) { const index = process.argv.indexOf(flag); if (index < 0 || !process.argv[index + 1]) throw new Error(`Missing ${flag}`); return path.resolve(process.argv[index + 1]); }
function main() {
  const output = value('--output');
  const python = value('--python');
  const split = value('--split');
  const snapshotRoot = value('--snapshot-root');
  const rootResolved = ROOT.toLowerCase();
  if (output.toLowerCase().startsWith(rootResolved)) throw new Error('Phase 5B Splat output must remain outside the integration repository');
  if (!split.toLowerCase().startsWith(snapshotRoot.toLowerCase() + path.sep.toLowerCase())) throw new Error('Phase 5B Splat must execute from the declared byte-clean snapshot');
  if (fs.existsSync(output) && fs.readdirSync(output).length) throw new Error('Phase 5B Splat output directory must be empty');
  fs.mkdirSync(output, { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'config', 'splat', 'us_rev0.yaml'), path.join(output, 'phase5b-splat.yaml'));
  fs.copyFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64'), path.join(output, 'baserom.us_rev0.z64'));
  const result = childProcess.spawnSync(python, ['-B', split, path.join(output, 'phase5b-splat.yaml')], { cwd: output, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  fs.writeFileSync(path.join(output, 'splat-command.json'), `${JSON.stringify({ command: [python, split, 'phase5b-splat.yaml'], exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`);
  if (result.status !== 0) throw new Error(`Splat execution failed: ${result.stderr || result.stdout}`);
  const linker = path.join(output, 'build', 'ob64_us_rev0_phase5b.ld');
  if (!fs.existsSync(linker)) throw new Error('Splat did not produce the expected linker input');
  console.log(`Phase 5B Splat execution: PASS (${linker})`);
}
main();
