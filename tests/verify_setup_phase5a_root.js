#!/usr/bin/env node
'use strict';

const assert = require('assert');
const path = require('path');
const { parseArgs, setupCommands } = require('../tools/verify_setup');

const explicit = path.resolve('external-phase5a-product');
assert.deepStrictEqual(parseArgs([]), { phase5aRoot: null });
assert.deepStrictEqual(parseArgs(['--phase5a-root', 'external-phase5a-product']), { phase5aRoot: explicit });
assert.throws(() => parseArgs(['--phase5a-root']), /Missing --phase5a-root value/);
assert.throws(() => parseArgs(['--phase5a-root', '--unknown']), /Missing --phase5a-root value/);
assert.throws(() => parseArgs(['--phase5a-root', 'one', '--phase5a-root', 'two']), /Duplicate --phase5a-root argument/);
assert.throws(() => parseArgs(['--unknown']), /Unknown argument/);

const defaultConsumer = setupCommands(parseArgs([])).find((args) => args[0] === 'tools/verify_phase5b_production_config.js');
assert.deepStrictEqual(defaultConsumer, ['tools/verify_phase5b_production_config.js']);
const explicitConsumer = setupCommands({ phase5aRoot: explicit }).find((args) => args[0] === 'tools/verify_phase5b_production_config.js');
assert.deepStrictEqual(explicitConsumer, ['tools/verify_phase5b_production_config.js', '--phase5a-root', explicit]);
assert.strictEqual(setupCommands({ phase5aRoot: explicit }).filter((args) => args.includes('--phase5a-root')).length, 1);

console.log('verify_setup_phase5a_root: PASS');
