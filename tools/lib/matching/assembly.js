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

function overlayForTarget(target, workbench) {
  if (target.overlayDescriptorId === null || target.overlayDescriptorId === undefined) return null;
  return workbench.model.overlays.find((overlay) => overlay.descriptor_id === target.overlayDescriptorId) || null;
}

function boundedSwitchEntryCount(infos, jrIndex, scaledRegister) {
  const scale = infos[jrIndex - 4];
  if (!scale || scale.op !== 0x00 || scale.funct !== 0x00 || scale.sa !== 2 || scale.rd !== scaledRegister) return null;
  for (let index = jrIndex - 5; index >= Math.max(0, jrIndex - 12); index -= 1) {
    const candidate = infos[index];
    if (candidate.op === 0x0B && candidate.rs === scale.rt
        && candidate.immediate >= 2 && candidate.immediate <= 1024) {
      return candidate.immediate;
    }
  }
  return null;
}

function discoverOverlayJumpTables(target, workbench, infos) {
  const overlay = overlayForTarget(target, workbench);
  if (!overlay || !workbench.baserom) return [];
  const tables = [];
  const seen = new Set();
  for (let jrIndex = 4; jrIndex < infos.length; jrIndex += 1) {
    const jump = infos[jrIndex];
    const load = infos[jrIndex - 1];
    const indexedBase = infos[jrIndex - 2];
    const high = infos[jrIndex - 3];
    if (jump.op !== 0x00 || jump.funct !== 0x08 || jump.rs === 31
        || load.op !== 0x23 || load.rt !== jump.rs
        || indexedBase.op !== 0x00 || indexedBase.funct !== 0x21 || indexedBase.rd !== load.rs
        || high.op !== 0x0F || high.rt !== load.rs) continue;
    let scaledRegister = null;
    if (indexedBase.rs === load.rs) scaledRegister = indexedBase.rt;
    else if (indexedBase.rt === load.rs) scaledRegister = indexedBase.rs;
    if (scaledRegister === null || scaledRegister === 0 || scaledRegister === load.rs) continue;
    const entryCount = boundedSwitchEntryCount(infos, jrIndex, scaledRegister);
    if (entryCount === null) continue;
    const tableVram = ((((high.immediate << 16) >>> 0) + load.signedImmediate) >>> 0);
    if (tableVram < overlay.data_rodata_start
        || tableVram + entryCount * 4 > overlay.data_rodata_end_exclusive) continue;
    const tableRom = overlay.rom_start + (tableVram - overlay.vram_start);
    if (tableRom < overlay.data_rodata_rom_start
        || tableRom + entryCount * 4 > overlay.data_rodata_rom_end_exclusive
        || tableRom + entryCount * 4 > workbench.baserom.length) continue;
    const targets = [];
    for (let index = 0; index < entryCount; index += 1) {
      const destination = workbench.baserom.readUInt32BE(tableRom + index * 4) >>> 0;
      if (destination < target.vramStart || destination >= target.vramEndExclusive || destination % 4 !== 0) {
        targets.length = 0;
        break;
      }
      targets.push(destination);
    }
    if (targets.length !== entryCount || seen.has(tableVram)) continue;
    seen.add(tableVram);
    tables.push({
      name: `jtbl_${tableVram.toString(16).toUpperCase().padStart(8, '0')}`,
      tableVram,
      tableRom,
      entryCount,
      targets,
      highIndex: jrIndex - 3,
      loadIndex: jrIndex - 1,
      jrIndex,
    });
  }
  return tables;
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
  const jumpTables = discoverOverlayJumpTables(target, workbench, infos);
  const tableAnnotations = new Map();
  for (const table of jumpTables) {
    table.targets.forEach((targetAddress) => internalLabels.add(targetAddress));
    tableAnnotations.set(table.highIndex, { kind: 'high', table });
    tableAnnotations.set(table.loadIndex, { kind: 'low', table });
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
    const tableAnnotation = tableAnnotations.get(index);
    if (tableAnnotation?.kind === 'high') {
      text = replaceFinalAddress(text, `%hi(${tableAnnotation.table.name})`);
    } else if (tableAnnotation?.kind === 'low') {
      text = text.replace(/-?0x[0-9A-F]+(?=\(\$)/i, `%lo(${tableAnnotation.table.name})`);
    } else if (info.target !== null) {
      const replacement = info.target >= target.vramStart && info.target < target.vramEndExclusive
        ? label(info.target)
        : externalName(info.target, workbench);
      text = replaceFinalAddress(text, replacement);
    }
    const rom = target.romStart + index * 4;
    lines.push(`/* ${rom.toString(16).toUpperCase().padStart(8, '0')} ${info.pc.toString(16).toUpperCase().padStart(8, '0')} ${info.word.toString(16).toUpperCase().padStart(8, '0')} */  ${text}`);
  });
  if (jumpTables.length) {
    lines.push('', '.rdata', '.align 2');
    for (const table of jumpTables) {
      lines.push(`glabel ${table.name}`);
      table.targets.forEach((targetAddress) => lines.push(`.word ${label(targetAddress)}`));
      lines.push('');
    }
  }
  lines.push('');
  return lines.join('\n');
}

module.exports = { discoverOverlayJumpTables, emitM2cAssembly, m2cDelaySlotGuardLabels };
