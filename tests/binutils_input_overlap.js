#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { parseElfFile, elfSectionBytes } = require('../tools/lib/phase7_conventional');
const { rawRelocationRecords } = require('../tools/lib/phase8_matching_c');
const { assertToolchainAvailable, loadToolchainConfig } = require('../tools/lib/real_mips_toolchain');

function verifyInputBufferShift(config, directory) {
  fs.mkdirSync(directory, { recursive: true });
  let cases = 0;
  let rejections = 0;
  function assemble(name, source, invalid = false) {
    const input = path.join(directory, name + '.s');
    const object = path.join(directory, name + '.o');
    fs.writeFileSync(input, source);
    const result = spawnSync(config.assemblerAbs,
      [...config.compilerAssemblerFlags, '-o', object, input],
      { encoding: 'utf8', windowsHide: true, maxBuffer: 1024 * 1024 });
    if (result.error) throw result.error;
    if (invalid) {
      assert.notStrictEqual(result.status, 0, name + ': invalid register was accepted');
      assert.match(result.stderr, /Illegal operands/, name + ': wrong rejection reason');
      rejections += 1;
      return;
    }
    assert.strictEqual(result.status, 0, name + ': ' + result.stderr);
    cases += 1;
    return parseElfFile(object);
  }
  function source(precision, pad, placement, eol, badRegister) {
    const suffix = placement === 'file' ? 'x'.repeat(pad) : '';
    const comment = placement === 'comment' ? '# ' + 'x'.repeat(pad) : '#';
    return [
      '.file 1 "input_shift' + suffix + '"', comment, '.text', '.set noreorder',
      '.globl kmc_input_shift_probe', 'kmc_input_shift_probe:',
      'mul.' + precision + ' $f0,$f2,$f4',
      'mul.' + precision + ' ' + (badRegister || '$f4,$f22,$f22'),
      '.word external_symbol', '',
    ].join(eol);
  }

  // Hand-encoded MIPS multiplies, the existing KMC hazard NOP, and one relocated
  // word. Position changes must neither corrupt operands nor suppress the NOP.
  for (const precision of ['s', 'd']) {
    const expected = precision === 's'
      ? '46041002000000004616B10200000000'
      : '46241002000000004636B10200000000';
    for (const placement of ['file', 'comment']) for (const eol of ['\n', '\r\n']) {
      for (let pad = 0; pad < 32; pad += 1) {
        const name = precision + '-' + placement + '-' + eol.length + '-' + pad;
        const elf = assemble(name, source(precision, pad, placement, eol));
        const sections = elf.sections.filter(section => section.name === '.text');
        assert.strictEqual(sections.length, 1, name + ': text ownership');
        assert.strictEqual(elfSectionBytes(elf, sections[0]).toString('hex').toUpperCase(), expected, name + ': bytes');
        const relocations = rawRelocationRecords(elf).map(record => ({
          offset: record.offset, type: record.type, symbol: record.symbol, section: record.section,
        }));
        assert.deepStrictEqual(relocations, [{
          offset: '0x0000000C', type: 'R_MIPS_32', symbol: 'external_symbol', section: '.rel.text',
        }], name + ': relocation preservation');
      }
    }
  }
  for (const [label, operands] of [['range', '$f4,$f32,$f22'], ['case', '$F4,$f22,$f22']]) {
    for (let pad = 0; pad < 16; pad += 1) {
      assemble('invalid-' + label + '-' + pad, source('s', pad, 'comment', '\n', operands), true);
    }
  }
  return { name: 'kmcInputBufferOverlapSafeShift', ok: true, cases, rejections };
}

if (require.main === module) {
  const config = assertToolchainAvailable(loadToolchainConfig());
  console.log(JSON.stringify(verifyInputBufferShift(config,
    path.resolve(__dirname, '../build/toolchain-input-overlap')), null, 2));
}
module.exports = { verifyInputBufferShift };
