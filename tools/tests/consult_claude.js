#!/usr/bin/env node
'use strict';
const path = require('path');
const { spawnSync } = require('child_process');
const result = spawnSync('python', [path.join(__dirname, 'consult_claude.py')], {
  stdio: 'inherit', windowsHide: true, timeout: 60000,
});
if (result.error) throw result.error;
process.exitCode = result.status === null ? 1 : result.status;
