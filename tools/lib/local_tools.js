'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_CONFIG_PATH = path.join(ROOT, 'config', 'local-tools.json');
const EXAMPLE_CONFIG_PATH = path.join(ROOT, 'config', 'local-tools.example.json');

const SETTINGS = Object.freeze({
  workRoot: { environment: 'OB64_WORK_ROOT', kind: 'directory', create: true },
  compiler: { environment: 'OB64_KMC_COMPILER', kind: 'file' },
  splatPython: { environment: 'OB64_SPLAT_PYTHON', kind: 'file' },
  splatSplit: { environment: 'OB64_SPLAT_SPLIT', kind: 'file' },
  splatSnapshotRoot: { environment: 'OB64_SPLAT_SNAPSHOT_ROOT', kind: 'directory' },
  asmDifferRoot: { environment: 'OB64_ASM_DIFFER_ROOT', kind: 'directory' },
  phase5aRoot: { environment: 'OB64_PHASE5A_ROOT', kind: 'directory', auditOnly: true },
  romInput: { environment: 'OB64_ROM_INPUT', kind: 'file', optional: true },
});

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function isInside(candidate, parent) {
  const resolvedCandidate = path.resolve(candidate).toLowerCase();
  const resolvedParent = path.resolve(parent).toLowerCase();
  return resolvedCandidate === resolvedParent || resolvedCandidate.startsWith(resolvedParent + path.sep);
}

function resolveConfiguredPath(value) {
  if (typeof value !== 'string' || value.trim() === '') return null;
  return path.isAbsolute(value) ? path.resolve(value) : path.resolve(ROOT, value);
}

function loadLocalConfig() {
  const selected = process.env.OB64_LOCAL_TOOLS
    ? path.resolve(process.env.OB64_LOCAL_TOOLS)
    : DEFAULT_CONFIG_PATH;
  if (!fs.existsSync(selected)) {
    throw new Error(`machine-local tool configuration is missing; copy ${EXAMPLE_CONFIG_PATH} to ${DEFAULT_CONFIG_PATH} or set OB64_LOCAL_TOOLS`);
  }
  const config = readJson(selected);
  if (!config || config.schemaVersion !== 1) throw new Error(`machine-local tool configuration schema drift: ${selected}`);
  return { config, path: selected };
}

function resolveLocalTools(options = {}) {
  const audit = options.audit === true;
  const { config, path: configPath } = loadLocalConfig();
  const resolved = { configPath };
  for (const [name, rule] of Object.entries(SETTINGS)) {
    if (rule.auditOnly && !audit) continue;
    const value = process.env[rule.environment] || config[name];
    const candidate = resolveConfiguredPath(value);
    if (!candidate) {
      if (rule.optional) {
        resolved[name] = null;
        continue;
      }
      throw new Error(`machine-local setting ${name} is missing (${rule.environment})`);
    }
    if (rule.create) fs.mkdirSync(candidate, { recursive: true });
    if (!fs.existsSync(candidate)) throw new Error(`machine-local ${name} does not exist: ${candidate}`);
    const stat = fs.statSync(candidate);
    if (rule.kind === 'file' && !stat.isFile()) throw new Error(`machine-local ${name} is not a file: ${candidate}`);
    if (rule.kind === 'directory' && !stat.isDirectory()) throw new Error(`machine-local ${name} is not a directory: ${candidate}`);
    resolved[name] = candidate;
  }
  if (isInside(resolved.workRoot, ROOT)) throw new Error('workRoot must remain outside the repository');
  if (!isInside(resolved.splatSplit, resolved.splatSnapshotRoot) || path.resolve(resolved.splatSplit).toLowerCase() === path.resolve(resolved.splatSnapshotRoot).toLowerCase()) {
    throw new Error('splatSplit must remain inside splatSnapshotRoot');
  }
  return resolved;
}

module.exports = {
  DEFAULT_CONFIG_PATH,
  EXAMPLE_CONFIG_PATH,
  ROOT,
  loadLocalConfig,
  resolveLocalTools,
};
