'use strict';
const cp = require('child_process');
const path = require('path');
const {resolveLocalTools} = require('../tools/lib/local_tools');
const root = path.resolve(__dirname, '..');
const scripts = ['matching_private_routing.js', 'matching_private_inputs.js', 'matching_private_publication.js', 'matching_private_preparation.js', 'matching_private_shared_publication.js'];
if (process.platform === 'win32') scripts.push('matching_private_paths.js');
for (const file of scripts) {
  const result = cp.spawnSync(process.execPath, [path.join(__dirname, file)], {cwd:root,stdio:'inherit',windowsHide:true});
  if (result.error || result.status !== 0) throw new Error(`private workspace test failed: ${file}: ${result.error || result.status}`);
}
if (process.platform === 'win32') {
  const result = cp.spawnSync(process.env.OB64_MATCH_PYTHON || resolveLocalTools().splatPython, [path.join(__dirname,'matching_private_guard.py'),'-v'], {cwd:root,stdio:'inherit',windowsHide:true});
  if (result.error || result.status !== 0) throw new Error(`private process guard test failed: ${result.error || result.status}`);
} else console.log('Windows process guard tests skipped on this platform; private CLI commands reject here.');
