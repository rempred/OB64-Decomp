import fs from 'node:fs';
import path from 'node:path';

const [inputPath, outputPath, requestedSymbol] = process.argv.slice(2);
if (!inputPath || !outputPath || !requestedSymbol) {
  console.error('usage: node convert-ob64-word-asm-to-objdump.mjs <input.s> <output.txt> <symbol>');
  process.exit(64);
}

const input = fs.readFileSync(inputPath, 'utf8');
const instructionPattern =
  /^\/\*\s*(0x[0-9a-f]+)\s+(0x[0-9a-f]+)\s+(0x[0-9a-f]+)\s*\*\/\s+\.word\s+0x[0-9a-f]+\s+#\s+([^\r\n]+)$/gim;
const instructions = [];
for (const match of input.matchAll(instructionPattern)) {
  const vram = Number.parseInt(match[2], 16);
  const decoded = match[4].trim().replace(/\$/g, '');
  const firstSpace = decoded.search(/\s/);
  let mnemonic = firstSpace === -1 ? decoded : decoded.slice(0, firstSpace);
  let operands = firstSpace === -1 ? '' : decoded.slice(firstSpace).trim();

  // Match GNU objdump's standard zero-compare aliases. asmlift's KMC jump-table
  // recognizer keys on the objdump spelling (`beqz`) rather than raw `beq r,zero`.
  const zeroBranch = operands.match(/^(\w+),\s*zero,\s*(.+)$/i);
  if (zeroBranch && (mnemonic === 'beq' || mnemonic === 'bne')) {
    mnemonic = mnemonic === 'beq' ? 'beqz' : 'bnez';
    operands = `${zeroBranch[1]}, ${zeroBranch[2]}`;
  }

  // GNU objdump's raw MIPS spelling includes the architecturally ignored `zero`
  // destination for a two-source divide. The accepted decode comments use the
  // conventional two-operand spelling; asmlift's MIPS frontend expects all three.
  if ((mnemonic === 'div' || mnemonic === 'divu') && /^[^,]+,\s*[^,]+$/u.test(operands)) {
    operands = `zero, ${operands}`;
  }

  if (/^(?:b|j)/i.test(mnemonic) && !/^(?:break|jalr|jr)$/i.test(mnemonic)) {
    operands = operands.replace(/(?:0x)?([0-9a-f]{8})$/i, (_whole, address) => {
      const normalized = address.toLowerCase();
      return `${normalized} <.L${normalized}>`;
    });
  }
  instructions.push({ vram, mnemonic, operands });
}

if (instructions.length === 0) {
  throw new Error(`no decode-comment instructions found in ${inputPath}`);
}

const lines = [`${instructions[0].vram.toString(16).padStart(8, '0')} <${requestedSymbol}>:`];
for (const instruction of instructions) {
  const suffix = instruction.operands ? `\t${instruction.operands}` : '';
  lines.push(` ${instruction.vram.toString(16).padStart(8, '0')}:\t${instruction.mnemonic}${suffix}`);
}
lines.push('');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join('\n'));
