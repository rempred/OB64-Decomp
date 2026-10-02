#!/usr/bin/env node
'use strict';
const { configure, prepare } = require('./core');
const { formatHuman } = require('../lib/matching/intake');
const { validateOptions } = require('../lib/matching/knowledge');
function parse(args) {
  const command = args.shift(), options = {};
  if (command === 'prepare') options.symbol = args.shift();
  const names = { '--config': 'config', '--out': 'out', '--output': 'output', '--kuna': 'kuna', '--specs': 'specs', '--python': 'python', '--m2c-root': 'm2cRoot', '--table': 'table', '--kuna-option': 'kunaOption', '--reason': 'reason', '--timeout-ms': 'timeoutMs' };
  while (args.length) {
    const arg = args.shift();
    if (['--fresh','--json','--include-details'].includes(arg)) { const key=arg.slice(2);if(options[key])throw new Error('duplicate option: '+arg);options[key]=true;continue; }
    if(['--cross-limit','--symptom'].includes(arg)){const key=arg.slice(2);if(!args.length||args[0].startsWith('--')||options[key]!==undefined)throw new Error('invalid or duplicate option: '+arg);options[key]=args.shift();continue;}
    if (!names[arg] || !args.length || args[0].startsWith('--') || options[names[arg]] !== undefined) throw new Error('invalid or duplicate option: ' + arg);
    options[names[arg]] = args.shift();
  }
  const allowed = command === 'prepare' ? ['symbol', 'config', 'out', 'table', 'kunaOption', 'reason', 'timeoutMs', 'fresh','json','include-details','cross-limit','symptom'] : ['output', 'kuna', 'specs', 'python', 'm2cRoot'];
  for (const key of Object.keys(options)) if (!allowed.includes(key)) throw new Error('option is not supported for ' + command + ': ' + key);
  if (options.timeoutMs) options.timeoutMs = Number(options.timeoutMs);
  if(command==='prepare')options.intakeOptions=validateOptions({crossLimit:options['cross-limit']===undefined?0:Number(options['cross-limit']),...(options.symptom===undefined?{}:{symptom:options.symptom})});
  return { command, options };
}
function main() {
  if (!process.argv[2] || ['--help', '-h'].includes(process.argv[2])) {
    console.log('Standalone analysis hypotheses; never compiles or changes accepted inputs.\nconfigure --output build/PATH/tools.json [--kuna EXE --specs DIR] [--python EXE --m2c-root DIR]\nprepare SYMBOL --config FILE --out build/PATH [--table ROM_START:BYTES] [--kuna-option NAME=VALUE --reason TEXT] [--fresh] [--timeout-ms N] [--json|--include-details] [--cross-limit 0..3] [--symptom LABEL]\n--json and --include-details both render the complete JSON result.'); return;
  }
  const { command, options } = parse(process.argv.slice(2));
  if (command === 'configure') console.log(JSON.stringify(configure(options), null, 2));
  else if (command === 'prepare') { const result = prepare(options); console.log(formatResult(result,options)); if (result.status === 'partial') process.exitCode = 2; }
  else throw new Error('unknown command');
}
if (require.main === module) try { main(); } catch (error) { console.error('analysis packet: ' + error.message); process.exitCode = 1; }
function formatResult(result,options={}) {
  if(options.json||options['include-details'])return JSON.stringify(result,null,2);
  const {researchIntake,...summary}=result;
  return JSON.stringify(summary,null,2)+(researchIntake?'\n'+formatHuman(researchIntake):'');
}
module.exports = { parse, formatResult };
