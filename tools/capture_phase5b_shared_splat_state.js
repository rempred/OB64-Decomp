#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
function value(flag) { const i = process.argv.indexOf(flag); if (i < 0 || !process.argv[i + 1]) throw new Error(`Missing ${flag}`); return path.resolve(process.argv[i + 1]); }
function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase(); }
function main() {
  const checkout = value('--checkout');
  const out = value('--out');
  const git = childProcess.spawnSync('git', ['-C', checkout, 'status', '--porcelain=v1', '--ignored', '--untracked-files=all'], { encoding: 'utf8' });
  if (git.status !== 0) throw new Error(git.stderr);
  const ordinary = [];
  const ignored = [];
  for (const line of git.stdout.split(/\r?\n/).filter(Boolean)) {
    const state = line.slice(0, 2); const relative = line.slice(3);
    if (state === '!!') {
      const file = path.join(checkout, relative);
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`Ignored path is not a file: ${relative}`);
      ignored.push({ path: relative.replace(/\\/g, '/'), bytes: fs.statSync(file).size, sha256: sha256(file) });
    } else ordinary.push(line);
  }
  const head = childProcess.spawnSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
  if (head.status !== 0) throw new Error(head.stderr);
  const result = { schemaVersion: 1, checkoutCommit: head.stdout.trim(), ordinaryStatus: ordinary, ignoredFiles: ignored.sort((a, b) => a.path.localeCompare(b.path)) };
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Shared Splat state captured: ${result.ignoredFiles.length} ignored file(s), ${ordinary.length} ordinary status line(s)`);
}
main();
