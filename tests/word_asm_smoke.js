#!/usr/bin/env node
const assert = require('assert');
const { assembleWordAsmText } = require('../tools/lib/word_asm');

const source = `
.set noat
.set noreorder
label:
/* 0x00001000 0x80070C00 0x3C08800B */ .word 0x3C08800B # lui $t0, 0x800B
.word 0x2508EDB0, 0
.word -1
`;

const assembled = assembleWordAsmText(source, 'word_asm_smoke');
assert.strictEqual(assembled.words, 4);
assert.strictEqual(assembled.bytes.toString('hex').toUpperCase(), '3C08800B2508EDB000000000FFFFFFFF');
console.log('word_asm_smoke: PASS');
