const fs = require('fs');
const path = require('path');

function stripInlineComment(text) {
  const hash = text.indexOf('#');
  const slashes = text.indexOf('//');
  let end = text.length;
  if (hash !== -1) end = Math.min(end, hash);
  if (slashes !== -1) end = Math.min(end, slashes);
  return text.slice(0, end);
}

function parseWordValue(token, context) {
  const valueText = token.trim();
  if (!valueText) throw new Error(`Empty .word value at ${context}`);
  if (!/^[+-]?(?:0x[0-9a-fA-F]+|\d+)$/.test(valueText)) {
    throw new Error(`Unsupported .word value "${valueText}" at ${context}`);
  }
  const negative = valueText.startsWith('-');
  const unsignedText = valueText.replace(/^[+-]/, '');
  const base = unsignedText.toLowerCase().startsWith('0x') ? 16 : 10;
  const magnitude = Number.parseInt(unsignedText, base);
  if (!Number.isSafeInteger(magnitude)) throw new Error(`Unsafe .word value "${valueText}" at ${context}`);
  const signed = negative ? -magnitude : magnitude;
  if (signed < -0x80000000 || signed > 0xffffffff) {
    throw new Error(`.word value out of 32-bit range "${valueText}" at ${context}`);
  }
  return signed >>> 0;
}

function assembleWordAsmText(text, sourceName = '<string>') {
  const words = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    let code = line;
    if (trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      const endComment = line.lastIndexOf('*/');
      if (endComment === -1) continue;
      code = line.slice(endComment + 2);
    }
    const match = code.match(/(?:^|[\s;])\.word\s+(.+)$/);
    if (!match) continue;
    const valuesText = stripInlineComment(match[1]).trim();
    if (!valuesText) throw new Error(`Missing .word value at ${sourceName}:${i + 1}`);
    const values = valuesText.split(',');
    for (const value of values) words.push(parseWordValue(value, `${sourceName}:${i + 1}`));
  }
  const bytes = Buffer.alloc(words.length * 4);
  for (let i = 0; i < words.length; i += 1) bytes.writeUInt32BE(words[i], i * 4);
  return { bytes, words: words.length };
}

function assembleWordAsmFile(filePath) {
  return assembleWordAsmText(fs.readFileSync(filePath, 'utf8'), filePath);
}

function assembleWordAsmFiles(files) {
  const buffers = [];
  let words = 0;
  for (const file of files) {
    const assembled = assembleWordAsmFile(file);
    buffers.push(assembled.bytes);
    words += assembled.words;
  }
  return { bytes: Buffer.concat(buffers), words };
}

function listAsmFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith('.s'))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => path.join(dir, name));
}

module.exports = {
  assembleWordAsmFile,
  assembleWordAsmFiles,
  assembleWordAsmText,
  listAsmFiles,
};
