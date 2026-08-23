'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('../phase7_conventional');
const { resolveLocalTools } = require('../local_tools');

const DATABASE = path.join(ROOT, 'build', 'matching', 'workbench.sqlite');
const SCHEMA = path.join(ROOT, 'tools', 'matching_workbench', 'schema.sql');
const BRIDGE = path.join(ROOT, 'tools', 'matching_workbench', 'store.py');

function pythonPath(options = {}) {
  if (options.python) return path.isAbsolute(options.python) ? path.resolve(options.python) : options.python;
  if (process.env.OB64_MATCH_PYTHON) return path.resolve(process.env.OB64_MATCH_PYTHON);
  return resolveLocalTools().splatPython;
}

function requestStore(request, options = {}) {
  const database = path.resolve(options.database || DATABASE);
  const python = pythonPath(options);
  const result = childProcess.spawnSync(python, [BRIDGE, '--database', database, '--schema', SCHEMA], {
    cwd: ROOT,
    encoding: 'utf8',
    input: JSON.stringify(request),
    windowsHide: true,
    maxBuffer: 128 * 1024 * 1024,
  });
  let payload = null;
  try {
    payload = JSON.parse(String(result.stdout || '').trim());
  } catch (_) {
    // The structured error below includes the raw process output.
  }
  if (result.status !== 0 || result.error || !payload || payload.ok !== true) {
    const detail = payload && payload.error
      ? payload.error
      : [result.stdout, result.stderr, result.error && String(result.error)].filter(Boolean).join('\n').trim();
    throw new Error(`matching workbench store failed: ${detail || 'unknown store error'}`);
  }
  return payload.result;
}

function initializeStore(options = {}) {
  if (!fs.existsSync(SCHEMA) || !fs.existsSync(BRIDGE)) throw new Error('matching workbench store implementation is missing');
  return requestStore({ action: 'init' }, options);
}

module.exports = {
  BRIDGE,
  DATABASE,
  SCHEMA,
  initializeStore,
  requestStore,
};
