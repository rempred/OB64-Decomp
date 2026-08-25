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

function isBranchLikely(info) {
  return [0x14, 0x15, 0x16, 0x17].includes(info.op)
    || (info.op === 0x01 && [0x02, 0x03, 0x12, 0x13].includes(info.rt));
}

function m2cDelaySlotGuardLabels(infos, start, end) {
  const guarded = new Set();
  for (let index = 0; index + 1 < infos.length; index += 1) {
    const branch = infos[index];
    if (!isBranchLikely(branch) || branch.target === null || branch.target < start || branch.target >= end) continue;
    const targetIndex = (branch.target - start) / 4;
    if (!Number.isInteger(targetIndex) || targetIndex < 2) continue;
    const targetPredecessor = infos[targetIndex - 1];
    const precedingControl = infos[targetIndex - 2];
    if (infos[index + 1].word === targetPredecessor.word
        && precedingControl.control
        && (precedingControl.call || isBranchLikely(precedingControl))) {
      guarded.add(branch.target >>> 0);
    }
  }
  return guarded;
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
  const guardedLabels = m2cDelaySlotGuardLabels(infos, target.vramStart, target.vramEndExclusive);
  const lines = [
    '.set noat',
    '.set noreorder',
    '',
    '.section .text',
    '',
    `glabel ${target.symbol}`,
  ];
  infos.forEach((info, index) => {
    if (index > 0 && internalLabels.has(info.pc)) {
      if (guardedLabels.has(info.pc)) {
        lines.push('nop # m2c analysis guard: keep an IDO likely-branch rewrite out of a call delay slot');
      }
      lines.push(`${label(info.pc)}:`);
    }
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

module.exports = { emitM2cAssembly, m2cDelaySlotGuardLabels };
