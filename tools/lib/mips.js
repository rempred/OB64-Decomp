const REG = [
  'zero', 'at', 'v0', 'v1', 'a0', 'a1', 'a2', 'a3',
  't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7',
  's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7',
  't8', 't9', 'k0', 'k1', 'gp', 'sp', 's8', 'ra',
];

const FREG = Array.from({ length: 32 }, (_, i) => `f${i}`);

function rn(index) {
  return `$${REG[index]}`;
}

function fr(index) {
  return `$${FREG[index]}`;
}

function hx(value, width = 8) {
  return `0x${(value >>> 0).toString(16).toUpperCase().padStart(width, '0')}`;
}

function sx16(value) {
  return value & 0x8000 ? value - 0x10000 : value;
}

function immText(signedValue) {
  return signedValue < 0 ? `-0x${(-signedValue).toString(16).toUpperCase()}` : `0x${signedValue.toString(16).toUpperCase()}`;
}

function memText(base, imm) {
  return `${immText(sx16(imm))}(${rn(base)})`;
}

function branchTarget(pc, imm) {
  return (pc + 4 + (sx16(imm) << 2)) >>> 0;
}

function jumpTarget(pc, word) {
  return (((word & 0x03FFFFFF) << 2) | ((pc + 4) & 0xF0000000)) >>> 0;
}

function disasmSpecial(word) {
  const rs = (word >>> 21) & 0x1F;
  const rt = (word >>> 16) & 0x1F;
  const rd = (word >>> 11) & 0x1F;
  const sa = (word >>> 6) & 0x1F;
  const fn = word & 0x3F;
  switch (fn) {
    case 0x00: return word === 0 ? 'nop' : `sll ${rn(rd)}, ${rn(rt)}, ${sa}`;
    case 0x02: return `srl ${rn(rd)}, ${rn(rt)}, ${sa}`;
    case 0x03: return `sra ${rn(rd)}, ${rn(rt)}, ${sa}`;
    case 0x04: return `sllv ${rn(rd)}, ${rn(rt)}, ${rn(rs)}`;
    case 0x06: return `srlv ${rn(rd)}, ${rn(rt)}, ${rn(rs)}`;
    case 0x07: return `srav ${rn(rd)}, ${rn(rt)}, ${rn(rs)}`;
    case 0x08: return `jr ${rn(rs)}`;
    case 0x09: return rd === 31 ? `jalr ${rn(rs)}` : `jalr ${rn(rd)}, ${rn(rs)}`;
    case 0x0C: return `syscall ${hx(word >>> 6, 5)}`;
    case 0x0D: return `break ${hx(word >>> 6, 5)}`;
    case 0x0F: return 'sync';
    case 0x10: return `mfhi ${rn(rd)}`;
    case 0x11: return `mthi ${rn(rs)}`;
    case 0x12: return `mflo ${rn(rd)}`;
    case 0x13: return `mtlo ${rn(rs)}`;
    case 0x14: return `dsllv ${rn(rd)}, ${rn(rt)}, ${rn(rs)}`;
    case 0x16: return `dsrlv ${rn(rd)}, ${rn(rt)}, ${rn(rs)}`;
    case 0x17: return `dsrav ${rn(rd)}, ${rn(rt)}, ${rn(rs)}`;
    case 0x18: return `mult ${rn(rs)}, ${rn(rt)}`;
    case 0x19: return `multu ${rn(rs)}, ${rn(rt)}`;
    case 0x1A: return `div ${rn(rs)}, ${rn(rt)}`;
    case 0x1B: return `divu ${rn(rs)}, ${rn(rt)}`;
    case 0x1C: return `dmult ${rn(rs)}, ${rn(rt)}`;
    case 0x1D: return `dmultu ${rn(rs)}, ${rn(rt)}`;
    case 0x1E: return `ddiv ${rn(rs)}, ${rn(rt)}`;
    case 0x1F: return `ddivu ${rn(rs)}, ${rn(rt)}`;
    case 0x20: return `add ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x21: return rt === 0 ? `move ${rn(rd)}, ${rn(rs)}` : `addu ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x22: return `sub ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x23: return `subu ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x24: return `and ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x25: return rt === 0 ? `move ${rn(rd)}, ${rn(rs)}` : `or ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x26: return `xor ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x27: return `nor ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x2A: return `slt ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x2B: return `sltu ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x2C: return `dadd ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x2D: return `daddu ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x2E: return `dsub ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x2F: return `dsubu ${rn(rd)}, ${rn(rs)}, ${rn(rt)}`;
    case 0x30: return `tge ${rn(rs)}, ${rn(rt)}`;
    case 0x31: return `tgeu ${rn(rs)}, ${rn(rt)}`;
    case 0x32: return `tlt ${rn(rs)}, ${rn(rt)}`;
    case 0x33: return `tltu ${rn(rs)}, ${rn(rt)}`;
    case 0x34: return `teq ${rn(rs)}, ${rn(rt)}`;
    case 0x36: return `tne ${rn(rs)}, ${rn(rt)}`;
    case 0x38: return `dsll ${rn(rd)}, ${rn(rt)}, ${sa}`;
    case 0x3A: return `dsrl ${rn(rd)}, ${rn(rt)}, ${sa}`;
    case 0x3B: return `dsra ${rn(rd)}, ${rn(rt)}, ${sa}`;
    case 0x3C: return `dsll32 ${rn(rd)}, ${rn(rt)}, ${sa}`;
    case 0x3E: return `dsrl32 ${rn(rd)}, ${rn(rt)}, ${sa}`;
    case 0x3F: return `dsra32 ${rn(rd)}, ${rn(rt)}, ${sa}`;
    default: return `special_${hx(fn, 2)}`;
  }
}

function disasmRegimm(word, pc) {
  const rs = (word >>> 21) & 0x1F;
  const rt = (word >>> 16) & 0x1F;
  const imm = word & 0xFFFF;
  const target = hx(branchTarget(pc, imm));
  switch (rt) {
    case 0x00: return `bltz ${rn(rs)}, ${target}`;
    case 0x01: return `bgez ${rn(rs)}, ${target}`;
    case 0x02: return `bltzl ${rn(rs)}, ${target}`;
    case 0x03: return `bgezl ${rn(rs)}, ${target}`;
    case 0x08: return `tgei ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x09: return `tgeiu ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x0A: return `tlti ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x0B: return `tltiu ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x0C: return `teqi ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x0E: return `tnei ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x10: return `bltzal ${rn(rs)}, ${target}`;
    case 0x11: return `bgezal ${rn(rs)}, ${target}`;
    case 0x12: return `bltzall ${rn(rs)}, ${target}`;
    case 0x13: return `bgezall ${rn(rs)}, ${target}`;
    default: return `regimm_${hx(rt, 2)} ${rn(rs)}, ${target}`;
  }
}

function disasmCop1(word, pc) {
  const rs = (word >>> 21) & 0x1F;
  const rt = (word >>> 16) & 0x1F;
  const rd = (word >>> 11) & 0x1F;
  const fs = rd;
  const fd = (word >>> 6) & 0x1F;
  const ft = rt;
  const fn = word & 0x3F;
  if (rs === 0x00) return `mfc1 ${rn(rt)}, ${fr(rd)}`;
  if (rs === 0x01) return `dmfc1 ${rn(rt)}, ${fr(rd)}`;
  if (rs === 0x02) return `cfc1 ${rn(rt)}, $${rd}`;
  if (rs === 0x04) return `mtc1 ${rn(rt)}, ${fr(rd)}`;
  if (rs === 0x05) return `dmtc1 ${rn(rt)}, ${fr(rd)}`;
  if (rs === 0x06) return `ctc1 ${rn(rt)}, $${rd}`;
  if (rs === 0x08) {
    const cond = (word >>> 16) & 0x3;
    const names = ['bc1f', 'bc1t', 'bc1fl', 'bc1tl'];
    return `${names[cond]} ${hx(branchTarget(pc, word & 0xFFFF))}`;
  }
  const fmtNames = { 0x10: 's', 0x11: 'd', 0x14: 'w', 0x15: 'l' };
  const fmt = fmtNames[rs] || `fmt${rs}`;
  const three = (name) => `${name}.${fmt} ${fr(fd)}, ${fr(fs)}, ${fr(ft)}`;
  const two = (name) => `${name}.${fmt} ${fr(fd)}, ${fr(fs)}`;
  switch (fn) {
    case 0x00: return three('add');
    case 0x01: return three('sub');
    case 0x02: return three('mul');
    case 0x03: return three('div');
    case 0x04: return two('sqrt');
    case 0x05: return two('abs');
    case 0x06: return two('mov');
    case 0x07: return two('neg');
    case 0x08: return two('round.l');
    case 0x09: return two('trunc.l');
    case 0x0A: return two('ceil.l');
    case 0x0B: return two('floor.l');
    case 0x0C: return two('round.w');
    case 0x0D: return two('trunc.w');
    case 0x0E: return two('ceil.w');
    case 0x0F: return two('floor.w');
    case 0x20: return two('cvt.s');
    case 0x21: return two('cvt.d');
    case 0x24: return two('cvt.w');
    case 0x25: return two('cvt.l');
    default:
      if ((fn & 0x30) === 0x30) return `c.${hx(fn & 0x0F, 1)}.${fmt} ${fr(fs)}, ${fr(ft)}`;
      return `cop1_${hx(fn, 2)}.${fmt}`;
  }
}

function disasmCop0(word, pc) {
  const rs = (word >>> 21) & 0x1F;
  const rt = (word >>> 16) & 0x1F;
  const rd = (word >>> 11) & 0x1F;
  if (rs === 0x00) return `mfc0 ${rn(rt)}, $${rd}`;
  if (rs === 0x04) return `mtc0 ${rn(rt)}, $${rd}`;
  if (rs === 0x08) {
    const cond = (word >>> 16) & 0x3;
    const names = ['bc0f', 'bc0t', 'bc0fl', 'bc0tl'];
    return `${names[cond]} ${hx(branchTarget(pc, word & 0xFFFF))}`;
  }
  if ((word & 0x03FFFFFF) === 0x18) return 'eret';
  return `cop0_${hx(rs, 2)}`;
}

function disasmWord(word, pc) {
  const op = (word >>> 26) & 0x3F;
  const rs = (word >>> 21) & 0x1F;
  const rt = (word >>> 16) & 0x1F;
  const imm = word & 0xFFFF;
  switch (op) {
    case 0x00: return disasmSpecial(word);
    case 0x01: return disasmRegimm(word, pc);
    case 0x02: return `j ${hx(jumpTarget(pc, word))}`;
    case 0x03: return `jal ${hx(jumpTarget(pc, word))}`;
    case 0x04: return `beq ${rn(rs)}, ${rn(rt)}, ${hx(branchTarget(pc, imm))}`;
    case 0x05: return `bne ${rn(rs)}, ${rn(rt)}, ${hx(branchTarget(pc, imm))}`;
    case 0x06: return `blez ${rn(rs)}, ${hx(branchTarget(pc, imm))}`;
    case 0x07: return `bgtz ${rn(rs)}, ${hx(branchTarget(pc, imm))}`;
    case 0x08: return `addi ${rn(rt)}, ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x09: return `addiu ${rn(rt)}, ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x0A: return `slti ${rn(rt)}, ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x0B: return `sltiu ${rn(rt)}, ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x0C: return `andi ${rn(rt)}, ${rn(rs)}, ${hx(imm, 4)}`;
    case 0x0D: return `ori ${rn(rt)}, ${rn(rs)}, ${hx(imm, 4)}`;
    case 0x0E: return `xori ${rn(rt)}, ${rn(rs)}, ${hx(imm, 4)}`;
    case 0x0F: return `lui ${rn(rt)}, ${hx(imm, 4)}`;
    case 0x10: return disasmCop0(word, pc);
    case 0x11: return disasmCop1(word, pc);
    case 0x14: return `beql ${rn(rs)}, ${rn(rt)}, ${hx(branchTarget(pc, imm))}`;
    case 0x15: return `bnel ${rn(rs)}, ${rn(rt)}, ${hx(branchTarget(pc, imm))}`;
    case 0x16: return `blezl ${rn(rs)}, ${hx(branchTarget(pc, imm))}`;
    case 0x17: return `bgtzl ${rn(rs)}, ${hx(branchTarget(pc, imm))}`;
    case 0x18: return `daddi ${rn(rt)}, ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x19: return `daddiu ${rn(rt)}, ${rn(rs)}, ${immText(sx16(imm))}`;
    case 0x1A: return `ldl ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x1B: return `ldr ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x20: return `lb ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x21: return `lh ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x22: return `lwl ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x23: return `lw ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x24: return `lbu ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x25: return `lhu ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x26: return `lwr ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x27: return `lwu ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x28: return `sb ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x29: return `sh ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x2A: return `swl ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x2B: return `sw ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x2C: return `sdl ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x2D: return `sdr ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x2E: return `swr ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x2F: return `cache ${hx(rt, 2)}, ${memText(rs, imm)}`;
    case 0x30: return `ll ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x31: return `lwc1 ${fr(rt)}, ${memText(rs, imm)}`;
    case 0x32: return `lwc2 $${rt}, ${memText(rs, imm)}`;
    case 0x34: return `lld ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x35: return `ldc1 ${fr(rt)}, ${memText(rs, imm)}`;
    case 0x36: return `ldc2 $${rt}, ${memText(rs, imm)}`;
    case 0x37: return `ld ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x38: return `sc ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x39: return `swc1 ${fr(rt)}, ${memText(rs, imm)}`;
    case 0x3A: return `swc2 $${rt}, ${memText(rs, imm)}`;
    case 0x3C: return `scd ${rn(rt)}, ${memText(rs, imm)}`;
    case 0x3D: return `sdc1 ${fr(rt)}, ${memText(rs, imm)}`;
    case 0x3E: return `sdc2 $${rt}, ${memText(rs, imm)}`;
    case 0x3F: return `sd ${rn(rt)}, ${memText(rs, imm)}`;
    default: return `op_${hx(op, 2)}`;
  }
}

function classifyInstruction(word) {
  const op = (word >>> 26) & 0x3F;
  if (word === 0) return 'nop';
  if (op === 0x02 || op === 0x03) return 'jump';
  if (op === 0x01 || (op >= 0x04 && op <= 0x07) || (op >= 0x14 && op <= 0x17)) return 'branch';
  if (op >= 0x20) return op >= 0x28 && op <= 0x3F ? 'memory' : 'memory';
  if (op === 0x00 && ((word & 0x3F) === 0x08 || (word & 0x3F) === 0x09)) return 'jump-register';
  return 'normal';
}

module.exports = {
  classifyInstruction,
  disasmWord,
  hx,
};
