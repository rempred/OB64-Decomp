'use strict';
// Research-host provenance only. Never used to authenticate the production cc1.
// Every byte except structurally parsed Rich and reproducible-link metadata
// must be identical, including PE directories, section headers, code and data.
function metadata(buffer) {
  function bounds(offset, size) { if (!Number.isSafeInteger(offset) || offset < 0 || offset + size > buffer.length) throw Error('PE bounds'); }
  function u32(o) { bounds(o, 4); return buffer.readUInt32LE(o); }
  if (buffer.toString('ascii', 0, 2) !== 'MZ') throw Error('not PE');
  const pe = u32(60); bounds(pe, 24);
  if (u32(pe) !== 0x4550 || buffer.readUInt16LE(pe + 4) !== 0x14c) throw Error('not x86 PE');
  const optional = pe + 24, size = buffer.readUInt16LE(pe + 20), n = buffer.readUInt16LE(pe + 6);
  bounds(optional, size);
  if (size !== 224 || buffer.readUInt16LE(optional) !== 0x10b || u32(optional + 92) !== 16) throw Error('PE32 optional shape');
  const headerEnd = optional + size + n * 40;
  const sections = Array.from({ length: n }, (_, i) => { const o = optional + size + i * 40; bounds(o, 40); return { name: buffer.toString('ascii', o, o + 8).replace(/\0+$/, ''), virtual: u32(o + 12), bytes: u32(o + 16), offset: u32(o + 20), flags: u32(o + 36) }; });
  for (const s of sections) { bounds(s.offset, s.bytes); if (s.offset < headerEnd) throw Error('section overlaps headers'); }
  const overlaps = (a, b) => a.offset < b.offset + b.bytes && b.offset < a.offset + a.bytes;
  for (let i = 0; i < sections.length; i++) for (let j = i + 1; j < sections.length; j++) if (overlaps(sections[i], sections[j])) throw Error('overlapping sections');
  function rva(value, length) { const found = sections.filter(s => value >= s.virtual && value + length <= s.virtual + s.bytes); if (found.length !== 1) throw Error('PE RVA ambiguity'); const offset = found[0].offset + value - found[0].virtual; bounds(offset, length); return offset; }
  const rich = buffer.indexOf(Buffer.from('Rich'), 64);
  if (rich < 0 || rich + 8 > pe || rich % 4) throw Error('Rich boundary');
  const key = u32(rich + 4); let start = -1;
  for (let o = 64; o < rich; o += 4) if ((u32(o) ^ key) >>> 0 === 0x536e6144) { if (start !== -1) throw Error('duplicate Rich start'); start = o; }
  if (start < 64 || (rich - start - 16) % 8 || [4, 8, 12].some(o => (u32(start + o) ^ key) !== 0)) throw Error('Rich shape');
  const allowed = [{ kind: 'rich-records', offset: start, bytes: rich + 8 - start }, { kind: 'coff-timestamp', offset: pe + 8, bytes: 4 }];
  const debugSize = u32(optional + 96 + 6 * 8 + 4), debug = rva(u32(optional + 96 + 6 * 8), debugSize);
  if (!debugSize || debugSize % 28) throw Error('debug directory shape');
  const entries = [], payloads = []; let repro = 0;
  for (let o = debug; o < debug + debugSize; o += 28) {
    const type = u32(o + 12), bytes = u32(o + 16), pointer = u32(o + 24);
    if (rva(u32(o + 20), bytes) !== pointer) throw Error('debug payload placement');
    const payload = { offset: pointer, bytes }, owner = sections.find(s => pointer >= s.offset && pointer + bytes <= s.offset + s.bytes);
    if (!owner || owner.flags & 0x20000000 || pointer < headerEnd || overlaps(payload, { offset: debug, bytes: debugSize }) || payloads.some(p => overlaps(p, payload))) throw Error('unsafe/overlapping debug payload');
    payloads.push(payload);
    entries.push({ type, bytes, pointer }); allowed.push({ kind: 'debug-timestamp', offset: o + 4, bytes: 4 });
    if (type === 16) {
      if (++repro !== 1 || bytes !== 36 || u32(pointer) !== 32) throw Error('REPRO digest shape');
      allowed.push({ kind: 'repro-digest', offset: pointer + 4, bytes: 32 });
    }
  }
  if (repro !== 1) throw Error('REPRO digest missing');
  for (let i = 0; i < allowed.length; i++) for (let j = i + 1; j < allowed.length; j++) if (overlaps(allowed[i], allowed[j])) throw Error('overlapping permitted metadata');
  return { pe, sections, entries, allowed };
}
function compare(a, b) {
  if (a.length !== b.length) throw Error('PE length drift');
  const left = metadata(a), right = metadata(b);
  if (JSON.stringify(left) !== JSON.stringify(right)) throw Error('PE layout/metadata interval drift');
  const differences = [];
  for (let o = 0; o < a.length; o++) if (a[o] !== b[o]) {
    const interval = left.allowed.find(i => o >= i.offset && o < i.offset + i.bytes);
    if (!interval) throw Error('nonmetadata PE difference at 0x' + o.toString(16));
    differences.push({ offset: o, before: a[o], after: b[o], kind: interval.kind });
  }
  return { schemaVersion: 1, metadataOnly: true, parsed: left, differences };
}
module.exports = { metadata, compare };
