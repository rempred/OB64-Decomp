const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, ensureDir, readJson } = require('./rom');

function loadToolchainConfig(configPath = path.join(ROOT, 'config', 'toolchain.json')) {
  const config = readJson(configPath);
  return {
    ...config,
    configPath,
    localRootAbs: path.resolve(ROOT, config.localRoot),
    assemblerAbs: path.resolve(ROOT, config.localRoot, config.assembler),
    objcopyAbs: path.resolve(ROOT, config.localRoot, config.objcopy),
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
  const missing = [];
  if (!fs.existsSync(config.assemblerAbs)) missing.push(config.assemblerAbs);
  if (!fs.existsSync(config.objcopyAbs)) missing.push(config.objcopyAbs);
  if (missing.length) {
    throw new Error(
      `MIPS toolchain is missing:\n${missing.join('\n')}\n` +
        `Expected ${config.id} under ${config.localRoot}.\n` +
        `Download: ${config.sourceUrl}`
    );
  }
  return config;
}

function toolVersion(exe) {
  const result = runTool(exe, ['--version']);
  return result.stdout.split(/\r?\n/)[0].trim();
}

function assembleFileToBinary({ source, outBin, outObj, config = loadToolchainConfig() }) {
  const tc = assertToolchainAvailable(config);
  ensureDir(path.dirname(outBin));
  const objectPath = outObj || path.join(path.dirname(outBin), `${path.basename(outBin, path.extname(outBin))}.o`);
  runTool(tc.assemblerAbs, [...tc.assemblerFlags, '-o', objectPath, source]);
  runTool(tc.objcopyAbs, [...tc.objcopyFlags, objectPath, outBin]);
  return {
    source,
    objectPath,
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
