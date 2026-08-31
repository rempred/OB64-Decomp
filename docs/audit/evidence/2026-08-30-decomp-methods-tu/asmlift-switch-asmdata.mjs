import fs from 'node:fs';

const [linkagePath, normalizedDisasmPath, outputPath, requestedSymbol] = process.argv.slice(2);
if (!linkagePath || !normalizedDisasmPath || !outputPath || !requestedSymbol) {
  console.error(
    'usage: node make-accepted-switch-asmdata.mjs <matching-c-linkage.json> <normalized.txt> <output.txt> <symbol>',
  );
  process.exit(64);
}

const linkage = JSON.parse(fs.readFileSync(linkagePath, 'utf8'));
const matches = [];
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (
    value.symbol === requestedSymbol &&
    Array.isArray(value.expectedRelocations) &&
    Array.isArray(value.auxiliarySections)
  ) {
    matches.push(value);
  }
  for (const child of Object.values(value)) visit(child);
}
visit(linkage);
if (matches.length !== 1) {
  throw new Error(`expected one structural record for ${requestedSymbol}, found ${matches.length}`);
}

const record = matches[0];
const switchSections = record.auxiliarySections.filter((section) => section.kind === 'switch-table');
if (switchSections.length !== 1) {
  throw new Error(`expected one switch table for ${requestedSymbol}, found ${switchSections.length}`);
}
const table = switchSections[0];
const header = fs.readFileSync(normalizedDisasmPath, 'utf8').match(/^([0-9a-f]+)\s+</i);
if (!header) throw new Error(`cannot read function VMA from ${normalizedDisasmPath}`);
const textBase = Number.parseInt(header[1], 16);

const hex = (value, width = 8) => value.toString(16).padStart(width, '0');
const lines = [
  `# Synthetic objdump side-table derived only from accepted linkage metadata for ${requestedSymbol}.`,
  `# Text base: 0x${hex(textBase)}; switch table ROM ${table.romStart}..${table.romEndExclusive}.`,
  'Contents of section .rodata:',
];
for (let offset = 0; offset < table.bytes; offset += 16) {
  const count = Math.min(16, table.bytes - offset);
  const groups = [];
  for (let group = 0; group < count; group += 4) {
    groups.push('00'.repeat(Math.min(4, count - group)));
  }
  lines.push(` ${hex(offset)} ${groups.join(' ')}  ${'.'.repeat(count)}`);
}

lines.push('', 'RELOCATION RECORDS FOR [.text]:', 'OFFSET TYPE VALUE');
for (const relocation of record.expectedRelocations) {
  if (relocation.section !== '.rel.text' || relocation.symbol !== '.rodata') continue;
  const address = textBase + Number.parseInt(relocation.offset, 16);
  lines.push(`${hex(address)} ${relocation.type} .rodata`);
}

lines.push('', 'RELOCATION RECORDS FOR [.rodata]:', 'OFFSET TYPE VALUE');
for (const relocation of table.expectedRelocations) {
  const target = textBase + Number.parseInt(relocation.addend, 16);
  lines.push(`${hex(Number.parseInt(relocation.offset, 16))} ${relocation.type} .text+0x${hex(target)}`);
}
lines.push('');
fs.writeFileSync(outputPath, lines.join('\n'));
