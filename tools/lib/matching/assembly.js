'use strict';

const { instructionInfo, wordsFromBuffer } = require('./mips_analysis');

function label(address) {
  return `.L_${(address >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

function externalName(address, workbench) {
  const matches = workbench.targets.filter((target) => target.entryVram === (address >>> 0));
  if (matches.length === 1) return matches[0].symbol;
  return `func_${(address >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

function replaceFinalAddress(text, replacement) {
  return text.replace(/0x[0-9A-F]+$/i, replacement);
}

function emitM2cAssembly(target, workbench) {
  if (!target.expectedBytes) throw new Error('m2c assembly export requires canonical target bytes');
  if (target.symbolByteOffset !== 0) {
    throw new Error(`${target.symbol} has a ${target.symbolByteOffset}-byte pre-label owner prefix and is not an ordinary m2c target`);
  }
  const words = wordsFromBuffer(target.expectedBytes);
  const infos = words.map((word, index) => instructionInfo(word, target.vramStart + index * 4));
  const internalLabels = new Set();
  for (const info of infos) {
    if (info.target !== null && info.target >= target.vramStart && info.target < target.vramEndExclusive) internalLabels.add(info.target >>> 0);
  }
  const lines = [
    '.set noat',
    '.set noreorder',
    '',
    '.section .text',
    '',
    `glabel ${target.symbol}`,
  ];
  infos.forEach((info, index) => {
    if (index > 0 && internalLabels.has(info.pc)) lines.push(`${label(info.pc)}:`);
    let text = info.text;
    if (info.target !== null) {
      const replacement = info.target >= target.vramStart && info.target < target.vramEndExclusive
        ? label(info.target)
        : externalName(info.target, workbench);
      text = replaceFinalAddress(text, replacement);
    }
    const rom = target.romStart + index * 4;
    lines.push(`/* ${rom.toString(16).toUpperCase().padStart(8, '0')} ${info.pc.toString(16).toUpperCase().padStart(8, '0')} ${info.word.toString(16).toUpperCase().padStart(8, '0')} */  ${text}`);
  });
  lines.push('');
  return lines.join('\n');
}

module.exports = { emitM2cAssembly };
