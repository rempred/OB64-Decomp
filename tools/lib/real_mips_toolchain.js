'use strict';

const crypto = require('crypto');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, ensureDir, readJson } = require('./rom');

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function loadToolchainConfig(configPath = path.join(ROOT, 'config', 'toolchain.json')) {
  const config = readJson(configPath);
  const provenancePath = path.join(ROOT, ...config.buildProvenance.split('/'));
  const provenance = readJson(provenancePath);
  const localRootAbs = path.resolve(ROOT, config.localRoot);
  const tools = Object.fromEntries(Object.entries(config.tools).map(([name, relative]) => [name, path.resolve(localRootAbs, relative)]));
  return {
    ...config,
    configPath,
    provenance,
    provenancePath,
    localRootAbs,
    toolsAbs: tools,
    assemblerAbs: tools.assembler,
    objcopyAbs: tools.objcopy,
    assemblerFlags: config.baselineAssemblerFlags,
    compilerAssemblerFlags: config.compilerAssemblerFlags,
    objcopyFlags: config.objcopyFlags,
  };
}

function runTool(exe, args, options = {}) {
  const result = spawnSync(exe, args, {
    cwd: options.cwd || ROOT,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: options.maxBuffer || 16 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const rendered = [result.stdout, result.stderr].filter(Boolean).join('\n');
    throw new Error(`Command failed (${result.status}): ${exe} ${args.join(' ')}\n${rendered}`);
  }
  return result;
}

function assertToolchainAvailable(config = loadToolchainConfig()) {
  if (config.schemaVersion !== 2 || config.sourceCommit !== config.provenance.source.commit) {
    throw new Error('GNU Binutils 2.6 toolchain/provenance schema drift');
  }
  for (const [name, file] of Object.entries(config.toolsAbs)) {
    const relative = `bin/${path.basename(file)}`;
    const expected = config.provenance.outputs[relative];
    if (!expected || !fs.existsSync(file) || fs.statSync(file).size !== expected.bytes || sha256File(file) !== expected.sha256) {
      throw new Error(`GNU Binutils 2.6 ${name} identity drift: ${file}`);
    }
  }
  return config;
}

function toolVersion(exe) {
  const result = runTool(exe, ['--version']);
  return `${result.stdout}${result.stderr}`.split(/\r?\n/)[0].trim()
    .replace(/^GNU .*\/(?:[^/]*-)?(objcopy|objdump) version /, 'GNU $1 version ');
}

function assembleFileToBinary({ source, outBin, outObj, config = loadToolchainConfig(), assemblerFlags = null }) {
  const tc = assertToolchainAvailable(config);
  ensureDir(path.dirname(outBin));
  const objectPath = outObj || path.join(path.dirname(outBin), `${path.basename(outBin, path.extname(outBin))}.o`);
  const extractionObject = path.join(path.dirname(objectPath), `${path.basename(objectPath, path.extname(objectPath))}.extraction.o`);
  runTool(tc.assemblerAbs, [...(assemblerFlags || tc.assemblerFlags), '-o', objectPath, source]);
  runTool(tc.objcopyAbs, [
    '--remove-section=.reginfo',
    '--remove-section=.pdr',
    '--remove-section=.comment',
    '--remove-section=.note',
    objectPath,
    extractionObject,
  ]);
  runTool(tc.objcopyAbs, [...tc.objcopyFlags, extractionObject, outBin]);
  return {
    source,
    objectPath,
    extractionObject,
    outBin,
    bytes: fs.statSync(outBin).size,
  };
}

module.exports = {
  assembleFileToBinary,
  assertToolchainAvailable,
  loadToolchainConfig,
  runTool,
  toolVersion,
};
