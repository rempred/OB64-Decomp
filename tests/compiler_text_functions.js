#!/usr/bin/env node
'use strict';

const { verifyCompilerTextFunctions } = require('../tools/lib/phase8_matching_c');

function expectRejection(name, pattern, callback) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return { name, status: 'rejected', message: error.message };
  }
  throw new Error(`mutation was accepted: ${name}`);
}

function main() {
  const section = { index: 7, name: '.ob64.r5116' };
  const target = {
    symbol: 'func_002861C8',
    vramStartNumber: 0x8022A1F8,
    compilerTextFunctionsExplicit: true,
    compilerTextFunctions: [
      {
        symbol: 'func_002861C8',
        offset: '0x00000000',
        offsetNumber: 0,
        bytes: 0x134,
        binding: 'GLOBAL',
        entryEvidence: 'owner',
      },
      {
        symbol: 'func_002861C8_scan',
        offset: '0x00000134',
        offsetNumber: 0x134,
        bytes: 0xFC,
        binding: 'LOCAL',
        entryEvidence: 'internal-call-only',
      },
      {
        symbol: 'func_002861C8_find',
        offset: '0x00000230',
        offsetNumber: 0x230,
        bytes: 0x4C,
        binding: 'LOCAL',
        entryEvidence: 'fixed-address-call',
      },
    ],
  };
  const objectSymbols = target.compilerTextFunctions.map((record) => ({
    name: record.symbol,
    value: record.offsetNumber,
    size: record.bytes,
    binding: record.binding === 'GLOBAL' ? 1 : 0,
    symbolType: 2,
    visibility: 0,
    sectionIndex: section.index,
  }));
  const objectElf = { symbols: objectSymbols };
  const linkedElf = {
    symbols: objectSymbols.map((symbol) => ({ ...symbol, value: symbol.value + target.vramStartNumber })),
  };
  const objectEvidence = verifyCompilerTextFunctions(objectElf, target, section);
  const linkedEvidence = verifyCompilerTextFunctions(linkedElf, target, section, true);
  if (objectEvidence.length !== 3
      || objectEvidence[1].value !== '0x00000134'
      || linkedEvidence[2].value !== '0x8022A428'
      || linkedEvidence.some((record, index) => (
        record.binding !== target.compilerTextFunctions[index].binding
        || record.entryEvidence !== target.compilerTextFunctions[index].entryEvidence
      ))) {
    throw new Error('compiler text-function evidence drift');
  }

  const mutate = (name, pattern, change) => expectRejection(name, pattern, () => {
    const elf = { symbols: objectSymbols.map((symbol) => ({ ...symbol })) };
    change(elf.symbols);
    verifyCompilerTextFunctions(elf, target, section);
  });
  const mutations = [
    mutate('missing local entry', /symbol census drift/, (symbols) => symbols.pop()),
    mutate('additional function entry', /symbol census drift/, (symbols) => symbols.push({
      ...symbols[2],
      name: 'invented_entry',
    })),
    mutate('wrong entry offset', /symbol placement drift/, (symbols) => { symbols[1].value += 4; }),
    mutate('wrong body size', /symbol placement drift/, (symbols) => { symbols[1].size -= 4; }),
    mutate('exported local entry', /symbol placement drift/, (symbols) => { symbols[1].binding = 1; }),
    mutate('hidden entry', /symbol placement drift/, (symbols) => { symbols[1].visibility = 2; }),
    mutate('non-function entry', /symbol census drift/, (symbols) => { symbols[1].symbolType = 0; }),
    mutate('wrong accepted section', /symbol census drift/, (symbols) => { symbols[1].sectionIndex += 1; }),
  ];

  console.log(JSON.stringify({ status: 'pass', functions: objectEvidence, mutations }, null, 2));
}

main();
