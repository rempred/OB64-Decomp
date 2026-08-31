'use strict';

// Exact raw one-function input contract used by the 2026-08-30 benchmark.
// The caller supplies the accepted target, accepted target model, and the
// repository's instructionInfo/wordsFromBuffer helpers at the frozen base.

function label(address) {
  return `.L_${(address >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

function replaceFinalAddress(text, replacement) {
  return text.replace(/0x[0-9A-F]+$/i, replacement);
}

function emitRawAssembly(target, workbench, instructionInfo, wordsFromBuffer) {
  const words = wordsFromBuffer(target.expectedBytes);
  const infos = words.map((word, index) => instructionInfo(word, target.vramStart + index * 4));
  const internalLabels = new Set();
  for (const info of infos) {
    if (info.target !== null && info.target >= target.vramStart && info.target < target.vramEndExclusive) {
      internalLabels.add(info.target >>> 0);
    }
  }
  const entryMap = new Map();
  for (const candidate of workbench.targets) {
    const key = candidate.entryVram >>> 0;
    if (!entryMap.has(key)) entryMap.set(key, []);
    entryMap.get(key).push(candidate.symbol);
  }
  const lines = ['.set noat', '.set noreorder', '', '.section .text', '', `glabel ${target.symbol}`];
  infos.forEach((info, index) => {
    if (index > 0 && internalLabels.has(info.pc)) lines.push(`${label(info.pc)}:`);
    let text = info.text;
    if (info.target !== null) {
      let replacement;
      if (info.target >= target.vramStart && info.target < target.vramEndExclusive) {
        replacement = label(info.target);
      } else {
        const matches = entryMap.get(info.target >>> 0) || [];
        replacement = matches.length === 1
          ? matches[0]
          : `func_${(info.target >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
      }
      text = replaceFinalAddress(text, replacement);
    }
    lines.push(`/* ${(target.romStart + index * 4).toString(16).toUpperCase().padStart(8, '0')} ${info.pc.toString(16).toUpperCase().padStart(8, '0')} ${info.word.toString(16).toUpperCase().padStart(8, '0')} */  ${text}`);
  });
  lines.push('');
  return lines.join('\n');
}

module.exports = { emitRawAssembly };
