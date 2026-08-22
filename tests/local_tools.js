#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { resolvePowerShellRuntime } = require('../tools/lib/phase7_conventional');
const { runtimeArgs } = require('../tools/lib/current_workflow');
const { EXAMPLE_CONFIG_PATH, SETTINGS } = require('../tools/lib/local_tools');

const expectedEnvironment = 'OB64_POWERSHELL_RUNTIME_ROOT';
assert.deepStrictEqual(SETTINGS.powershellRuntimeRoot, {
  environment: expectedEnvironment,
  kind: 'directory',
});

const example = JSON.parse(fs.readFileSync(EXAMPLE_CONFIG_PATH, 'utf8'));
assert.strictEqual(typeof example.powershellRuntimeRoot, 'string');
assert.strictEqual(example._environmentOverrides.powershellRuntimeRoot, expectedEnvironment);

const configuredRoot = path.resolve('fixture-pinned-windows-runtime');
const ambientRoot = path.resolve('fixture-ambient-windows');
const explicit = resolvePowerShellRuntime(
  { powershellRuntimeRoot: configuredRoot },
  { OB64_POWERSHELL_RUNTIME_ROOT: ambientRoot, WINDIR: ambientRoot },
);
assert.strictEqual(explicit.root, configuredRoot);
assert.strictEqual(explicit.executable, path.join(configuredRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'));
assert.strictEqual(explicit.automationAssembly, path.join(configuredRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'System.Management.Automation.dll'));

const environmentOverride = resolvePowerShellRuntime({}, {
  OB64_POWERSHELL_RUNTIME_ROOT: configuredRoot,
  WINDIR: ambientRoot,
});
assert.strictEqual(environmentOverride.root, configuredRoot);
assert.throws(() => resolvePowerShellRuntime({}, {}), /configure powershellRuntimeRoot/);

const args = runtimeArgs({
  powershellRuntimeRoot: configuredRoot,
  splatPython: 'python.exe',
  splatSplit: 'split.py',
  asmDifferRoot: 'asm-differ',
});
assert.deepStrictEqual(args.slice(0, 2), ['--powershell-runtime-root', configuredRoot]);

console.log('local_tools: PASS');
