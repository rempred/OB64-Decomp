'use strict';
// Reviewed facts bridge indirect storage; types always come from the invocation and provider AST.
const fs = require('fs'),
  path = require('path'),
  crypto = require('crypto');
const types = require('./c_interface_types');
const digest = b => crypto.createHash('sha256').update(Buffer.isBuffer(b) || typeof b === 'string' ? b : JSON
  .stringify(b)).digest('hex').toUpperCase();
const fail = m => {
  throw Error('C interface site evidence: ' + m);
};
const FILE = 'config/c-interface-sites.json';

function numeric(x) {
  if (!Number.isSafeInteger(x) || x < 0) fail('invalid numeric site coordinate');
  return x;
}

function check(root, output, buildReport, units, linked, {
  prior,
  scope
}) {
  const file = path.join(root, FILE),
    bytes = fs.existsSync(file) ? fs.readFileSync(file) : null;
  const config = bytes ? JSON.parse(bytes) : {
    schemaVersion: 1,
    relationships: []
  };
  if (config.schemaVersion !== 1 || !Array.isArray(config.relationships)) fail(
    'malformed reviewed relationships');
  let image;
  const sections = new Map(linked.sections.map(s => [s.name, s]));

  function linkedImage() {
    if (!image) {
      image = fs.readFileSync(path.join(output, 'phase8.elf'));
      const expected = buildReport.outputs.elf;
      if (!expected || image.length !== expected.bytes || digest(image) !== expected.sha256) fail(
        'linked image identity');
    }
    return image;
  }

  function authenticateSource(pin) {
    const matches = units.filter(u => u.identity.source === pin.source);
    if (matches.length !== 1) fail('unresolved support producer ' + pin.source);
    const u = matches[0],
      functions = u.analysis.functions.filter(f => f.definition && f.name === pin.owner);
    if (functions.length !== 1 || functions[0].bodyFingerprint !== pin.functionFingerprint) fail(
      'source relationship changed: ' + pin.source + '#' + pin.owner);
    return {
      u,
      fn: functions[0]
    };
  }

  function checkWindow(w) {
    const s = sections.get(w.section);
    if (!s || !(s.flags & 4) || !Array.isArray(w.words) || !w.words.length) fail(
      'invalid executable evidence section');
    numeric(w.offset);
    if (w.offset % 4 || w.offset + w.words.length * 4 > s.size) fail(
    'evidence window outside complete owner');
    for (let i = 0; i < w.words.length; i++)
      if (linkedImage().readUInt32BE(s.offset + w.offset + i * 4) !== numeric(w.words[i])) fail(
        'linked instruction window changed');
    return {
      section: s.name,
      address: s.address + w.offset,
      offset: w.offset,
      words: w.words
    };
  }

  function checkRelocation(r) {
    const replacements = buildReport.targetReplacements.filter(t => t.symbol === r.owner && t.source === r
      .source);
    if (replacements.length !== 1) fail('relocation producer ambiguous');
    const row = replacements[0],
      matches = (row.relocations || []).filter(x => x.offset === r.offset && x.type === r.type && x.symbol ===
        r.symbol);
    if (matches.length !== 1) fail('named relocation relationship changed');
    return {
      owner: r.owner,
      source: r.source,
      offset: r.offset,
      type: r.type,
      symbol: r.symbol,
      record: matches[0]
    };
  }
  const relationships = [],
    conflicts = [],
    limitations = [],
    ids = new Set();
  for (const entry of config.relationships) {
    if (typeof entry.id !== 'string' || !entry.id || ids.has(entry.id) || !['known-callback',
        'unresolved-supplier', 'known-assembly-return-use'
      ].includes(entry.kind)) fail('invalid/duplicate relationship');
    ids.add(entry.id);
    if (entry.kind === 'known-assembly-return-use') {
      if (!entry.source || !entry.target || !entry.invocation || !entry.observation) fail(
        'incomplete reviewed assembly relationship');
      const sourceBytes = fs.readFileSync(path.join(root, entry.source.path));
      if (digest(sourceBytes) !== entry.source.sha256) fail('reviewed assembly source changed');
      const manifestPin = buildReport.acceptedInputs.phase7Model.find(x => x.path ===
        'asm/original/rev0/manifest.json');
      if (!manifestPin) fail('assembly manifest missing');
      const manifestBytes = fs.readFileSync(path.join(root, manifestPin.path));
      if (digest(manifestBytes) !== manifestPin.sha256) fail('assembly manifest changed');
      const parts = JSON.parse(manifestBytes).chunks.flatMap(c => c.parts);
      if (!parts.some(p => p.file === entry.source.path && p.sha256 === entry.source.sha256)) fail(
        'assembly source not accepted');
      const iw = checkWindow(entry.invocation),
        section = sections.get(iw.section),
        words = iw.words;
      if (words.length !== 3 || words[0] >>> 26 !== 3) fail('unsupported reviewed assembly call pattern');
      const address = ((((iw.address + 4) >>> 0) & 0xF0000000) | ((words[0] & 0x03FFFFFF) << 2)) >>> 0;
      const owners = linked.sections.filter(s => (s.flags & 6) === 6 && address >= s.address && address < s
          .address + s.size),
        targetUnit = units.find(u => u.identity.source === entry.target.source),
        defs = targetUnit?.analysis.functions.filter(f => f.definition && f.name === entry.target.name) || [],
        syms = linked.symbols.filter(s => s.name === entry.target.name && s.binding === 1 && s.symbolType ===
          2 && s.sectionIndex > 0 && s.sectionIndex !== 65521);
      if (owners.length !== 1 || owners[0].name !== entry.target.section || syms.length !== 1 || syms[0]
        .value !== address || entry.target.address !== address || defs.length !== 1 || !targetUnit.sections
        .includes(entry.target.section)) fail('assembly target identity or overlay changed');
      const loads = linked.programHeaders.filter(p => p.type === 1 && section.offset >= p.offset && section
        .offset + section.size <= p.offset + p.fileSize);
      if (loads.length !== 1) fail('reviewed assembly LOAD identity');
      const rom = loads[0].paddr + section.offset - loads[0].offset + iw.offset;
      if (!parts.some(p => p.file === entry.source.path && rom >= Number(p.romStart) && rom + 12 <= Number(p
          .romEndExclusive))) fail('reviewed assembly source does not own call');
      const delay = instructionFacts(words[1]),
        use = instructionFacts(words[2]);
      if (!delay.known || delay.writes.includes(2) || !use.known || !use.reads.includes(2)) fail(
        'reviewed unmodified return consumption no longer established');
      const result = defs[0].contract?.result?.kind === 'void' ? 'incompatible' : defs[0].contract?.result
        ?.kind === 'unknown' ? 'unknown' : 'compatible';
      const row = {
        ...entry,
        result,
        definition: defs[0].contractCanonical,
        uncertainty: 'This proves non-void return consumption only; register words do not determine complete C argument types.'
      };
      relationships.push(row);
      if (result === 'incompatible') conflicts.push({
        ...row,
        kind: 'assembly-consumes-void-result'
      });
      if (result === 'unknown') limitations.push({
        reason: 'assembly-result-type-unresolved',
        ...row
      });
      continue;
    }
    if (!entry.caller || !Array.isArray(entry.support) || !entry.support.length || !Array.isArray(entry
        .windows) || !entry.windows.length || typeof entry.reason !== 'string' || !entry.reason.trim()) fail(
      'missing source/link relationship evidence');
    const {
      u,
      fn
    } = authenticateSource(entry.caller), calls = u.analysis.calls.filter(c => c.owner === entry.caller.owner && c
      .anchor === entry.caller.anchor && c.occurrence === entry.caller.occurrence);
    if (calls.length !== 1 || calls[0].name) fail('indirect invocation identity changed');
    const call = calls[0];
    const support = entry.support.map(p => {
        authenticateSource(p);
        return p;
      }),
      windows = entry.windows.map(checkWindow),
      relocations = (entry.relocations || []).map(checkRelocation);
    const invocation = entry.invocation;
    if (!invocation) fail('missing actual invocation instruction');
    const iw = checkWindow({
      section: invocation.section,
      offset: invocation.offset,
      words: [invocation.word]
    });
    const instruction = invocation.word >>> 0;
    if (instruction >>> 26 !== 0 || (instruction & 63) !== 9) fail('known indirect invocation is not JALR');
    if (!u.sections.includes(invocation.section)) fail('invocation is outside calling producer');
    const row = {
      id: entry.id,
      kind: entry.kind,
      caller: entry.caller,
      support,
      windows,
      relocations,
      invocation: iw,
      reason: entry.reason,
      invoked: call.invokedCanonical
    };
    if (entry.kind === 'known-callback') {
      if (!entry.target || !relocations.some(r => r.symbol === entry.target.name)) fail(
        'known callback lacks named address relocation');
      const targetUnits = units.filter(x => x.identity.source === entry.target.source);
      if (targetUnits.length !== 1) fail('missing callback target producer');
      const target = targetUnits[0],
        defs = target.analysis.functions.filter(f => f.definition && f.name === entry.target.name),
        syms = linked.symbols.filter(s => s.name === entry.target.name && s.binding === 1 && s.symbolType ===
          2 && s.sectionIndex > 0 && s.sectionIndex !== 65521);
      if (defs.length !== 1 || syms.length !== 1 || linked.sections[syms[0].sectionIndex]?.name !== entry
        .target.section || syms[0].value !== entry.target.address || !target.sections.includes(entry.target
          .section)) fail('callback physical target identity/overlay changed');
      if (!entry.setter || !entry.storage || entry.setter.name !== entry.storage.owner) fail(
        'known relationship requires actual setter and field store');
      const setterUnit = units.find(x => x.identity.source === entry.setter.source),
        setterCalls = setterUnit?.analysis.calls.filter(c => c.owner === entry.setter.owner && c.name ===
          entry.setter.name && c.anchor === entry.setter.anchor && c.occurrence === entry.setter.occurrence
          ) || [];
      if (setterCalls.length !== 1 || setterCalls[0].argumentFunctions?.[entry.setter.argumentIndex] !== entry
        .target.name) fail('known callback setter argument changed');
      const storageUnit = units.find(x => x.identity.source === entry.storage.source),
        stores = storageUnit?.analysis.stores?.filter(s => s.owner === entry.storage.owner && s.anchor ===
          entry.storage.anchor && s.parameterIndex === entry.setter.argumentIndex) || [];
      if (stores.length !== 1 || !call.member || stores[0].member.name !== call.member.name || stores[0]
        .member.ownerType !== call.member.ownerType) fail(
      'callback stored field and invocation field differ');
      row.setter = entry.setter;
      row.storage = entry.storage;
      row.target = entry.target;
      row.completeTargetSet = false;
      row.definition = defs[0].contractCanonical;
      row.result = types.compare(call.invoked, defs[0].contract, u.analysis.typeRecords, target.analysis
        .typeRecords);
      if (row.result === 'incompatible') conflicts.push({
        ...row,
        kind: 'known-callback-signature'
      });
      else if (row.result === 'unknown') limitations.push({
        reason: 'known-callback-type-unresolved',
        ...row
      });
    } else {
      if (entry.target) fail('unknown supplier cannot claim a target');
      row.result = 'unknown';
      limitations.push({
        reason: 'unresolved-callback-supplier',
        ...row
      });
    }
    relationships.push(row);
  }
  // A baseline edit cannot erase an evidenced target while its invocation remains.
  for (const old of prior?.relationships || []) {
    if (old.kind === 'known-assembly-return-use') {
      const replacement = relationships.find(r => r.id === old.id);
      if (!replacement || replacement.kind !== old.kind || JSON.stringify(replacement.target) !== JSON
        .stringify(old.target) || replacement.source.path !== old.source.path) fail(
        'removed or replaced reviewed assembly relationship: ' + old.id);
      continue;
    }
    if (old.kind !== 'known-callback') continue;
    // Token anchors change when a caller adds a cast. The physical invocation is
    // the retirement boundary; the same retained JALR must keep its known target.
    const site = old.invocation;
    if (!site) fail('trusted callback lacks linked invocation: ' + old.id);
    const section = sections.get(site.section);
    numeric(site.offset);
    const retained = section && site.offset + 4 <= section.size && (() => {
      const word = linkedImage().readUInt32BE(section.offset + site.offset);
      return word >>> 26 === 0 && (word & 63) === 9;
    })();
    const replacement = relationships.find(r => r.id === old.id);
    if (retained && (!replacement || replacement.kind !== 'known-callback' || replacement.invocation
        .section !== site.section || replacement.invocation.offset !== site.offset || JSON.stringify(
          replacement.target) !== JSON.stringify(old.target))) fail(
      'removed or replaced known callback at retained linked invocation: ' + old.id);
  }

  if (bytes && !fs.readFileSync(file).equals(bytes) || !bytes && fs.existsSync(file)) fail(
    'relationship configuration changed during scan');
  return {
    relationships,
    conflicts,
    limitations,
    input: bytes ? {
      path: FILE,
      sha256: digest(bytes),
      bytes: bytes.length
    } : null
  };
}
module.exports = {
  check,
  FILE
};
// Decode only register read/write facts; no type or control-flow semantics are inferred.
function instructionFacts(word) {
  const op = word >>> 26,
    rs = word >>> 21 & 31,
    rt = word >>> 16 & 31,
    rd = word >>> 11 & 31,
    fn = word & 63;
  let reads = [],
    writes = [],
    known = true;
  if (op === 0) {
    if ([0, 2, 3].includes(fn)) {
      reads = [rt];
      writes = [rd];
    } else if ([4, 6, 7, 32, 33, 34, 35, 36, 37, 38, 39, 42, 43].includes(fn)) {
      reads = [rs, rt];
      writes = [rd];
    } else if (fn === 8) reads = [rs];
    else if (fn === 9) {
      reads = [rs];
      writes = [rd];
    } else known = false;
  } else if ([8, 9, 10, 11, 12, 13, 14].includes(op)) {
    reads = [rs];
    writes = [rt];
  } else if (op === 15) writes = [rt];
  else if ([32, 33, 35, 36, 37].includes(op)) {
    reads = [rs];
    writes = [rt];
  } else if ([40, 41, 43].includes(op)) reads = [rs, rt];
  else if ([4, 5].includes(op)) reads = [rs, rt];
  else if ([6, 7].includes(op)) reads = [rs];
  else if (op === 3) writes = [31];
  else if (op !== 2) known = false;
  return {
    word,
    reads: reads.filter(x => x),
    writes: writes.filter(x => x),
    known
  };
}

function assemblyEvidence(root, output, buildReport, units, linked, scope) {
  const sourceOwners = new Map();
  for (const replacement of buildReport.targetReplacements || []) {
    const unit = units.find(item => item.identity.source === replacement.source);
    if (!unit) continue;
    const unparsed = unit.analysis.status !== 'parsed';
    const explicitNames = new Set((unit.analysis.assemblyTransfers || []).map(item => item.name));
    if (!unparsed && (replacement.sourceClass !== 'HYBRID_C' || !explicitNames.size)) continue;
    for (const owner of replacement.owners || []) {
      sourceOwners.set(owner.sectionName, { unit, unparsed, explicitNames,
        logicalOffset: owner.logicalOffset, relocations: replacement.relocations || [] });
    }
  }

  const all = scope.mode.startsWith('all-');
  const changed = new Set(scope.changedFunctions);
  const targets = new Map();
  const cOwnedSections = new Set(units.flatMap(unit => unit.sections));
  for (const unit of units) {
    for (const definition of unit.analysis.functions) {
      if (!definition.definition || definition.local ||
          (!all && !changed.has(unit.identity.source + '#' + definition.name))) continue;
      const symbols = linked.symbols.filter(symbol => symbol.name === definition.name &&
        symbol.binding === 1 && symbol.sectionIndex > 0 && symbol.sectionIndex !== 65521);
      if (symbols.length !== 1) continue;
      const symbol = symbols[0];
      const providers = targets.get(symbol.value) || [];
      providers.push({ source: unit.identity.source, name: definition.name,
        section: linked.sections[symbol.sectionIndex]?.name, address: symbol.value,
        signature: definition.contractCanonical });
      targets.set(symbol.value, providers);
    }
  }
  const consideredSections = linked.sections.filter(section =>
    (section.flags & 6) === 6 && section.size > 0 &&
    (!cOwnedSections.has(section.name) || sourceOwners.has(section.name)));
  if (!targets.size || !consideredSections.length) return [];

  const image = fs.readFileSync(path.join(output, 'phase8.elf'));
  const elfPin = buildReport.outputs.elf;
  if (!elfPin || image.length !== elfPin.bytes || digest(image) !== elfPin.sha256) {
    fail('assembly sweep ELF identity');
  }
  const manifestPin = buildReport.acceptedInputs.phase7Model.find(item =>
    item.path === 'asm/original/rev0/manifest.json');
  if (!manifestPin) fail('assembly source manifest identity missing');
  const manifestBytes = fs.readFileSync(path.join(root, manifestPin.path));
  if (digest(manifestBytes) !== manifestPin.sha256) fail('assembly source manifest changed');
  const parts = JSON.parse(manifestBytes).chunks.flatMap(chunk => chunk.parts);
  const authenticatedSources = new Map();
  const observations = [];

  for (const section of consideredSections) {
    const loads = linked.programHeaders.filter(segment => segment.type === 1 &&
      section.offset >= segment.offset && section.offset + section.size <= segment.offset + segment.fileSize);
    if (loads.length !== 1) fail('assembly owner LOAD attribution');
    const romStart = loads[0].paddr + section.offset - loads[0].offset;
    for (let offset = 0; offset + 4 <= section.size; offset += 4) {
      const word = image.readUInt32BE(section.offset + offset);
      const opcode = word >>> 26;
      if (opcode !== 2 && opcode !== 3) continue;
      const address = ((((section.address + offset + 4) >>> 0) & 0xF0000000) |
        ((word & 0x03FFFFFF) << 2)) >>> 0;
      const candidates = targets.get(address);
      if (!candidates) continue;
      const sourceOwner = sourceOwners.get(section.name);
      if (sourceOwner) {
        // Explicit asm and unparsed C have no reliable CallExpr here. Require
        // an actual named relocation at this physical instruction, including
        // aliases resolving to the same linked entry; ordinary hybrid calls
        // without an explicit asm spelling stay in the normal C call census.
        const namedTransfer = sourceOwner.relocations.some(relocation =>
          relocation.type === 'R_MIPS_26' &&
          (sourceOwner.unparsed || sourceOwner.explicitNames.has(relocation.symbol)) &&
          Number(relocation.offset) === sourceOwner.logicalOffset + offset &&
          linked.symbols.some(symbol => symbol.name === relocation.symbol && symbol.value === address));
        if (!namedTransfer) continue;
      }
      const physicalOwners = linked.sections.filter(owner => (owner.flags & 6) === 6 &&
        address >= owner.address && address < owner.address + owner.size);
      const unique = candidates.length === 1 && physicalOwners.length === 1 &&
        physicalOwners[0].name === candidates[0].section;
      const originalParts = parts.filter(part => romStart + offset >= Number(part.romStart) &&
        romStart + offset < Number(part.romEndExclusive));
      if (originalParts.length !== 1) fail('assembly source input attribution');
      const originalPart = originalParts[0];
      if (!authenticatedSources.has(originalPart.file)) {
        const sourceBytes = fs.readFileSync(path.join(root, originalPart.file));
        if (digest(sourceBytes) !== originalPart.sha256) fail('assembly source input changed');
        authenticatedSources.set(originalPart.file, { path: originalPart.file, sha256: originalPart.sha256 });
      }
      const instructions = [];
      for (let instructionOffset = Math.max(0, offset - 32);
          instructionOffset < Math.min(section.size, offset + 40); instructionOffset += 4) {
        instructions.push({ offset: instructionOffset, address: section.address + instructionOffset,
          rom: romStart + instructionOffset,
          ...instructionFacts(image.readUInt32BE(section.offset + instructionOffset)) });
      }
      const argumentSetup = [4, 5, 6, 7].map(register => ({ register,
        writes: instructions.filter(instruction => instruction.offset <= offset + 4 &&
          instruction.writes.includes(register)),
        origin: 'bounded-instruction-window; earlier/path-dependent origin unresolved' }));
      const resultUses = instructions.filter(instruction => instruction.offset >= offset + 8 &&
        instruction.reads.some(register => register === 2 || register === 3));
      observations.push({
        kind: sourceOwner?.unparsed ? 'unparsed-C-incoming-call' :
          opcode === 3 ? 'assembly-direct-call' : 'assembly-tail-transfer',
        source: authenticatedSources.get(originalPart.file),
        ...(sourceOwner?.unparsed ? { unparsedCaller: sourceOwner.unit.identity } :
          sourceOwner ? { inlineAssemblyProducer: sourceOwner.unit.identity,
            inlineAssemblyTransfers: sourceOwner.unit.analysis.assemblyTransfers } : {}),
        section: section.name, address: section.address + offset, rom: romStart + offset, word,
        targetAddress: address, target: unique ? candidates[0] : null, candidates,
        attribution: unique ? 'unique-executable-owner' : 'unresolved-overlay-or-owner',
        argumentSetup, resultUses, window: instructions,
        uncertainty: sourceOwner?.unparsed ?
          'Known named incoming transfer from a Clang-unparsed C owner; inspect source/ASM. No compatible C declaration is asserted.' :
          'Register facts do not establish C types, path reachability, full stack arguments, or lack of later result use.'
      });
    }
  }
  return observations;
}
module.exports.assemblyEvidence = assemblyEvidence;
module.exports.instructionFacts = instructionFacts;
