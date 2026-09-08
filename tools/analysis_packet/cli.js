#!/usr/bin/env node
'use strict';
const { configure, prepare } = require('./core');
function parse(args) {
  const command = args.shift(), options = {};
  if (command === 'prepare') options.symbol = args.shift();
  const names = { '--config': 'config', '--out': 'out', '--output': 'output', '--kuna': 'kuna', '--specs': 'specs', '--python': 'python', '--m2c-root': 'm2cRoot', '--table': 'table', '--kuna-option': 'kunaOption', '--reason': 'reason', '--timeout-ms': 'timeoutMs' };
  while (args.length) {
    const arg = args.shift(); if (arg === '--fresh') { options.fresh = true; continue; }
    if (!names[arg] || !args.length || args[0].startsWith('--') || options[names[arg]] !== undefined) throw new Error('invalid or duplicate option: ' + arg);
    options[names[arg]] = args.shift();
  }
  const allowed = command === 'prepare' ? ['symbol', 'config', 'out', 'table', 'kunaOption', 'reason', 'timeoutMs', 'fresh'] : ['output', 'kuna', 'specs', 'python', 'm2cRoot'];
  for (const key of Object.keys(options)) if (!allowed.includes(key)) throw new Error('option is not supported for ' + command + ': ' + key);
  if (options.timeoutMs) options.timeoutMs = Number(options.timeoutMs);
  return { command, options };
}
function main() {
  if (!process.argv[2] || ['--help', '-h'].includes(process.argv[2])) {
    console.log('Standalone analysis hypotheses; never compiles or changes accepted inputs.\nconfigure --output build/PATH/tools.json [--kuna EXE --specs DIR] [--python EXE --m2c-root DIR]\nprepare SYMBOL --config FILE --out build/PATH [--table ROM_START:BYTES] [--kuna-option NAME=VALUE --reason TEXT] [--fresh] [--timeout-ms N]'); return;
  }
  const { command, options } = parse(process.argv.slice(2));
  if (command === 'configure') console.log(JSON.stringify(configure(options), null, 2));
  else if (command === 'prepare') { const result = prepare(options); console.log(JSON.stringify(result, null, 2)); if (result.status === 'partial') process.exitCode = 2; }
  else throw new Error('unknown command');
}
if (require.main === module) try { main(); } catch (error) { console.error('analysis packet: ' + error.message); process.exitCode = 1; }
module.exports = { parse };
