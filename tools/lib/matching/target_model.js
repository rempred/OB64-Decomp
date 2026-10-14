'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { loadActiveTargetModel, resolveAcceptedRow, resolveAcceptedRows } = require('../active_targets');
const logical = require('../logical_functions');
const { resolveWorkbenchActiveTarget } = require('../text_contract');
// Keep scratch admission in this sealed comparison-algorithm input.
const GROUP_REASON = 'group workbench requires a complete group candidate; use canonical diff with the group source';
const LIVE_TARGET_FIELDS = ['activeMatchingSource', 'activeMatchingProducer', 'scratchCompilation', 'requestedSymbol'];

function isActiveTarget(target) {
  return Boolean(target.activeMatchingProducer || target.activeMatchingSource);
}

function scratchCapability(workbench, target, sessionTargets = []) {
  // Stored target records deliberately omit live producer state.
  const key = String(target.symbol || '').toLowerCase();
  const activeEntries = [...new Set([...(workbench?.activeTargetsBySymbol?.values() || []), ...sessionTargets])];
  const active = resolveWorkbenchActiveTarget(activeEntries, target);
  const exactKeyRecord = workbench?.activeTargetsBySymbol?.get(key);
  const live = workbench?.bySymbol?.get(key);
  const sessionTarget = sessionTargets.find(value => value.symbol.toLowerCase() === key);
  const atomicOverlapping = activeEntries.filter(value => value?.atomicText
    && value.romStartNumber < (target.romEndExclusive ?? target.romEndNumber)
    && value.romEndNumber > (target.romStart ?? target.romStartNumber));
  if ([target, active, exactKeyRecord, live, sessionTarget, ...atomicOverlapping].some(value => value?.atomicText))
    return { supported:false, code:'atomic-owner-candidate-required', reason:'atomic owner union scratch compilation is unsupported; use its complete canonical producer' };
  const overlapping = target.selectionKind === 'logical-body'
    ? [...(workbench?.activeTargetsBySymbol?.values() || [])].filter(value => value.romStartNumber < target.romEndExclusive && value.romEndNumber > target.romStart) : [];
  if ([target, live, active, exactKeyRecord, sessionTarget, ...overlapping].some(value => value?.compilationGroup
      || value?.activeMatchingProducer?.kind === 'compilation-group')) {
    return { supported: false, code: 'complete-group-candidate-required', reason: GROUP_REASON };
  }
  if (target.placementKind === 'rom-only') return {
    supported: false, code: 'unqualified-runtime-placement', reason: 'scratch generation requires qualified runtime placement',
  };
  let completeCoverage = true;
  if (target.logicalFunctions) {
    let cursor = target.romStart;
    const pieces = target.logicalCoverage || [];
    const functionPieces = pieces.filter(piece => piece.kind === 'function');
    completeCoverage = pieces.length > 0 && pieces.every(piece => {
      const valid = ['function','padding'].includes(piece.kind) && piece.romStart === cursor && piece.romEndExclusive > cursor;
      cursor = piece.romEndExclusive; return valid;
    }) && cursor === target.romEndExclusive && target.logicalFunctions.length === functionPieces.length
      && target.logicalFunctions.every((fn, index) => fn.romStart === functionPieces[index].romStart
        && fn.romEndExclusive === functionPieces[index].romEndExclusive && fn.offset === fn.romStart - target.romStart
        && fn.bytes === fn.romEndExclusive - fn.romStart);
  }
  if (target.logicalFunctions && (!target.logicalCoverageComplete || !completeCoverage)) return {
    supported: false, code: 'incomplete-logical-coverage', reason: 'complete candidate requires resolved logical coverage; inspect proven bodies individually',
  };
  if (target.selectionKind === 'logical-body' && active) return {
    supported: false, code: 'physical-producer-required', reason: 'active target requires its complete physical producer contract',
  };
  return { supported: true, code: null, reason: null };
}

function assertScratchCapability(workbench, target, sessionTargets) {
  const capability = scratchCapability(workbench, target, sessionTargets);
  if (!capability.supported) throw new Error(capability.reason);
  assertExecutablePrefixSelection(workbench, target);
  if (target.logicalFunctions && (!target.expectedBytes || sha256Buffer(target.expectedBytes) !== target.expectedBytesSha256)) throw new Error('logical target expected bytes drift');
}

function producerView(active) {
  if (!active) return null;
  if (!active.compilationGroup) return { kind: 'standalone', source: active.source };
  return {
    kind: 'compilation-group', id: active.compilationGroup.id, source: active.source,
    memberIndex: active.groupMemberIndex,
    members: active.compilationGroup.members.map(member => ({ ...member })),
  };
}
const {
  CONFIG_PATH: PHASE7_CONFIG_PATH,
  ROOT,
  sha256Buffer,
  sha256File,
} = require('../phase7_conventional');

const CONFIG_PATH = path.join(ROOT, 'config', 'matching-workbench.json');
const SEMANTIC_PATH = path.join(ROOT, 'config', 'splat', 'us_rev0.semantic.json');
const ACTIVE_PATH = path.join(ROOT, 'config', 'matching-c-targets.json');
const BASEROM_PATH = path.join(ROOT, 'build', 'baserom.us_rev0.z64');

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : canonicalJson(value)).digest('hex').toUpperCase();
}

function hex(value) {
  return `0x${(value >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadBaserom(model) {
  if (!fs.existsSync(BASEROM_PATH)) throw new Error('canonical normalized baserom is missing; run node tools/verify_baserom.js');
  const bytes = fs.readFileSync(BASEROM_PATH);
  if (bytes.length !== model.config.rom.bytes || sha256Buffer(bytes) !== model.config.rom.sha256) {
    throw new Error('canonical normalized baserom identity drift');
  }
  return bytes;
}

function functionPartStem(name) {
  const match = /^(func_[0-9a-f]{8})(?:_chunk[0-9]+head)?$/i.exec(String(name || ''));
  return match ? match[1].toLowerCase() : null;
}

function continuationPartStem(name) {
  const match = /^(func_[0-9a-f]{8})_chunk[0-9]+tail$/i.exec(String(name || ''));
  return match ? match[1].toLowerCase() : null;
}

// Select code bytes only; the complete original row remains the ASM fallback.
// The caller supplies the authenticated model AND its live multi-owner registry.
function retainedPaddingSelection(authority, row, baserom = null, requestedSymbol = null) {
  if (!row?.retainedPadding) return null;
  if (!authority?.model || !(authority.multiOwnerContracts instanceof Map) || !authority.multiOwnerConfigIdentity
      || [...authority.multiOwnerContracts.values()].some(c=>c.rows.some(r=>r.index===row.index))) throw new Error('retained padding producer requires standalone accepted membership');
  baserom ||= authority.baserom || loadBaserom(authority.model);
  const registry=logical.loadRegistry(authority.model,baserom);
  const edge=logical.assertRetainedPaddingProducer(registry,row);
  const symbol=edge.bodies[0].symbol;
  if(requestedSymbol!==null&&requestedSymbol!==symbol)throw new Error('retained padding cannot select a padding or partial-body entry');
  const body=edge.body, hash=s=>sha256Buffer(baserom.subarray(s.romStart,s.romEndExclusive));
  return {symbol,selectionKind:'registered-padding-producer',entryEvidence:'registered-complete-producer',
    primaryId:row.primaryId,rowIndex:row.index,romStart:body.romStart,romEndExclusive:body.romEndExclusive,bytes:body.bytes,
    vramStart:body.vramStart,vramEndExclusive:body.vramEndExclusive,entryVram:body.vramStart,symbolByteOffset:0,
    sectionName:body.sectionName,placementKind:body.placementKind,overlayDescriptorId:body.overlayDescriptorId,loadSlabId:body.loadSlabId,
    originalAssembly:row.part.file,originalAssemblySha256:row.part.sha256,
    logicalFunctions:edge.bodies.map((b,i)=>({symbol:b.symbol,binding:edge.record.compilerFunctions[i].binding,romStart:b.romStart,romEndExclusive:b.romEndExclusive,offset:b.romStart-body.romStart,bytes:b.romEndExclusive-b.romStart,evidence:b.evidence,fragments:b.fragments})),
    logicalCoverage:logical.coverage(registry,body.romStart,body.romEndExclusive,baserom),logicalCoverageComplete:true,
    originalOwner:{schemaVersion:1,rowIndex:row.index,primaryId:row.primaryId,chunkIndex:row.part.chunkIndex,
      acceptedModelSha256:digest({config:authority.model.config,inputs:authority.model.inputFiles,multiOwnerConfig:authority.multiOwnerConfigIdentity}),
      symbol:row.part.name,romStart:row.romStart,romEndExclusive:row.romEndExclusive,bytes:row.bytes,originalAssembly:row.part.file,originalAssemblySha256:row.part.sha256,
      expectedBytesSha256:hash(row),comparedSection:body.sectionName,slices:row.slices.map(s=>({...s,expectedBytesSha256:hash(s),comparisonRole:s.retainedPaddingId?'retained-original-assembly':'compared-complete-producer'}))}};
}
function executablePrefixSelection(authority, row, baserom = null, requestedSymbol = row?.part?.name) {
  const model = authority?.model;
  if (!model || !(authority.multiOwnerContracts instanceof Map) || !authority.multiOwnerConfigIdentity)
    throw new Error('executable-prefix selection requires authenticated owner membership');
  const slices = row?.slices;
  if (!row || row.primaryClass !== 'code' || row.ambiguous !== false || row.inputKind !== 'tracked-assembly'
      || !row.part || ![true, false].includes(row.part.hasOwnerLabel) || row.part.symbolByteOffset !== 0
      || !Array.isArray(slices) || slices.length !== 2 || slices[0].executable !== true || slices[1].executable !== false
      || continuationPartStem(row.part.name) || /_chunk[0-9]+head$/i.test(row.part.name)) return null;
  // Existing structural metadata can identify an unlabeled original owner.
  // It does not authorize an arbitrary label or an interior-address function.
  const structuralNames = [row.part.name.toLowerCase(), `func_${hex(row.romStart).slice(2)}`.toLowerCase()];
  if (typeof requestedSymbol !== 'string' || !structuralNames.includes(requestedSymbol.toLowerCase())) return null;
  // A member cannot become an independent candidate, including the contract's
  // primary member. resolveAcceptedRows alone permits that complete contract.
  if ([...authority.multiOwnerContracts.values()].some(contract => contract.rows.some(member => member.index === row.index))) return null;
  const [prefix, tail] = slices;
  const word = value => Number.isSafeInteger(value) && value >= 0 && value % 4 === 0;
  const extent = value => word(value.romStart) && word(value.romEndExclusive) && word(value.bytes) && value.bytes > 0
    && value.romEndExclusive - value.romStart === value.bytes && word(value.vramStart) && word(value.vramEndExclusive)
    && value.vramEndExclusive - value.vramStart === value.bytes;
  const placementFields = ['placementKind', 'overlayDescriptorId', 'loadSlabId', 'overlaySection'];
  if (!word(row.romStart) || !word(row.romEndExclusive) || row.bytes !== row.romEndExclusive - row.romStart
      || row.part.romStartNumber !== row.romStart || row.part.romEndNumber !== row.romEndExclusive || row.part.bytes !== row.bytes
      || model.rows.filter(value => value.index === row.index || value.part?.name.toLowerCase() === row.part.name.toLowerCase()).length !== 1
      || !['overlay', 'non-descriptor-load-slab', 'early-boot-linear'].includes(prefix.placementKind)
      || placementFields.some(field => prefix[field] !== tail[field])
      || prefix.romStart !== row.romStart || prefix.romEndExclusive !== tail.romStart || tail.romEndExclusive !== row.romEndExclusive
      || prefix.vramEndExclusive !== tail.vramStart || typeof tail.nonExecutableRangeId !== 'string' || !tail.nonExecutableRangeId
      || prefix.nonExecutableRangeId !== null || tail.executableRangeId !== null
      || prefix.sectionName === tail.sectionName || prefix.ordinal === tail.ordinal
      || slices.some((slice, index) => !extent(slice) || slice.rowIndex !== row.index || slice.primaryId !== row.primaryId
        || slice.inputKind !== 'tracked-assembly' || slice.ownerName !== row.name
        || slice.sliceIndex !== index || slice.sliceCount !== 2
        || model.slices.filter(value => value.sectionName === slice.sectionName || value.ordinal === slice.ordinal).length !== 1
        || canonicalJson(model.slices.find(value => value.sectionName === slice.sectionName)) !== canonicalJson(slice))) return null;
  const accepted = resolveAcceptedRows(model, requestedSymbol, authority.multiOwnerContracts);
  const owner = accepted.owners[0];
  if (accepted.contract || accepted.rows.length !== 1 || accepted.rows[0] !== row || accepted.owners.length !== 1
      || owner.sectionName !== prefix.sectionName || owner.romStartNumber !== prefix.romStart
      || owner.romEndNumber !== prefix.romEndExclusive || owner.vramStartNumber !== prefix.vramStart
      || owner.vramEndNumber !== prefix.vramEndExclusive || owner.bytes !== prefix.bytes) return null;
  const bytesHash = slice => baserom ? sha256Buffer(baserom.subarray(slice.romStart, slice.romEndExclusive)) : null;
  return {
    selectionKind: 'executable-prefix', entryEvidence: row.part.hasOwnerLabel ? 'actual-label' : 'accepted-owner-metadata',
    primaryId: row.primaryId, rowIndex: row.index,
    romStart: prefix.romStart, romEndExclusive: prefix.romEndExclusive, bytes: prefix.bytes,
    vramStart: prefix.vramStart, vramEndExclusive: prefix.vramEndExclusive, entryVram: prefix.vramStart,
    symbolByteOffset: 0, sectionName: prefix.sectionName, placementKind: prefix.placementKind,
    overlayDescriptorId: prefix.overlayDescriptorId, loadSlabId: prefix.loadSlabId,
    originalAssembly: row.part.file, originalAssemblySha256: row.part.sha256,
    originalOwner: {
      schemaVersion: 1, rowIndex: row.index, primaryId: row.primaryId, chunkIndex: row.part.chunkIndex,
      acceptedModelSha256: digest({ config: model.config, inputs: model.inputFiles, multiOwnerConfig: authority.multiOwnerConfigIdentity }),
      symbol: row.part.name, romStart: row.romStart, romEndExclusive: row.romEndExclusive, bytes: row.bytes,
      originalAssembly: row.part.file, originalAssemblySha256: row.part.sha256,
      expectedBytesSha256: bytesHash(row), comparedSection: prefix.sectionName,
      slices: slices.map(slice => ({ ...slice, expectedBytesSha256: bytesHash(slice),
        comparisonRole: slice.executable ? 'compared-executable-prefix' : 'retained-original-assembly' })),
    },
  };
}

// Existing logical bodies can occupy interior executable slices of coarse data
// rows. Authenticate their established registry contract before prefix inference;
// a caller's selectionKind alone never grants this route.
function authenticatedSplitLogicalBody(authority, target) {
  if (target.selectionKind !== 'logical-body' || target.originalOwner !== undefined || target.entryEvidence !== undefined) return false;
  const baserom = authority.baserom || loadBaserom(authority.model);
  const registry = logical.loadRegistry(authority.model, baserom);
  const bodies = registry.bodies.filter(body => [body.symbol, ...body.aliases].some(symbol => symbol.toLowerCase() === target.symbol.toLowerCase()));
  if (bodies.length !== 1) return false;
  const body = bodies[0], first = body.fragments[0], last = body.fragments[body.fragments.length - 1];
  const row = authority.model.rows.find(value => value.index === first.rowIndex);
  const expected = { primaryId: row.primaryId, rowIndex: row.index, romStart: body.romStart,
    romEndExclusive: body.romEndExclusive, bytes: body.romEndExclusive - body.romStart,
    vramStart: first.vramStart, vramEndExclusive: last.vramStart + last.bytes,
    entryVram: first.vramStart, symbolByteOffset: 0, sectionName: first.sectionName,
    placementKind: first.placementKind, overlayDescriptorId: first.overlayDescriptorId, loadSlabId: first.loadSlabId,
    originalAssembly: first.file, originalAssemblySha256: first.sha256, logicalFragments: body.fragments,
    logicalFunctions: [{ symbol: target.symbol, romStart: body.romStart, romEndExclusive: body.romEndExclusive,
      offset: 0, bytes: body.romEndExclusive - body.romStart, evidence: body.evidence, fragments: body.fragments }],
    logicalCoverage: logical.coverage(registry, body.romStart, body.romEndExclusive, baserom), logicalCoverageComplete: true,
    expectedBytesSha256: body.expectedBytesSha256 };
  if (Object.entries(expected).some(([field, value]) => canonicalJson(target[field]) !== canonicalJson(value))
      || !Buffer.isBuffer(target.expectedBytes) || !target.expectedBytes.equals(baserom.subarray(body.romStart, body.romEndExclusive))
      || authority.modelId && target.modelId !== authority.modelId) return false;
  return true;
}

function assertExecutablePrefixSelection(authority, target) {
  const claimsPrefix = ['executable-prefix','registered-padding-producer'].includes(target?.selectionKind) || target?.originalOwner !== undefined
    || /^\.ob64\.r[0-9]+\.s[0-9]+$/.test(target?.sectionName || '');
  if (!authority?.model) {
    if (claimsPrefix) throw new Error('executable-prefix selection requires an authenticated live model');
    return;
  }
  const edgeRow=authority.model.rows.find(row=>row.retainedPadding && row.index===target?.rowIndex);
  if(edgeRow){
    // Existing complete logical-body research selections remain diagnostic only.
    if (authenticatedSplitLogicalBody(authority, target)) return;
    const selected=retainedPaddingSelection(authority,edgeRow,authority.baserom||loadBaserom(authority.model),target.symbol);
    for(const [key,value] of Object.entries(selected))if(canonicalJson(target[key])!==canonicalJson(value))throw new Error('retained padding selection identity drift: '+key);
    if(target.requestedSymbol!==undefined&&target.requestedSymbol.toLowerCase()!==selected.symbol.toLowerCase())throw new Error('retained padding requested partial entry');
    if(!Buffer.isBuffer(target.expectedBytes)||!target.expectedBytes.equals((authority.baserom||loadBaserom(authority.model)).subarray(selected.romStart,selected.romEndExclusive))
       ||target.expectedBytesSha256!==sha256Buffer(target.expectedBytes)||authority.modelId&&target.modelId!==authority.modelId)throw new Error('retained padding comparison identity');
    return;
  }
  const splitHint = authority.model.rows.some(value => value.slices.length > 1
    && (value.index === target?.rowIndex || target?.romStart >= value.romStart && target?.romStart < value.romEndExclusive));
  const namedSplit = authority.model.rows.some(value => value.slices.length > 1 && value.part
    && [value.part.name.toLowerCase(), `func_${hex(value.romStart).slice(2)}`.toLowerCase()].includes(String(target?.symbol || '').toLowerCase()));
  if (!claimsPrefix && !splitHint && !namedSplit) return;
  if ((claimsPrefix || splitHint) && authenticatedSplitLogicalBody(authority, target)) return;
  let row;
  try { row = resolveAcceptedRow(authority.model, String(target?.symbol || '')); }
  catch (error) { if (claimsPrefix || splitHint) throw new Error('executable-prefix structural symbol does not resolve: ' + error.message); return; }
  if (row.slices.length === 1 && !claimsPrefix && !splitHint) return;
  // All split-row requests, including stripped descriptors, are checked here.
  const baserom = authority.baserom || loadBaserom(authority.model);
  const selected = executablePrefixSelection(authority, row, baserom, target.symbol);
  if (!selected) throw new Error('unsupported executable-prefix selection or owner membership');
  if (target.requestedSymbol !== undefined && !executablePrefixSelection(authority, row, baserom, target.requestedSymbol))
    throw new Error('executable-prefix requested structural symbol is unsupported');
  if (target.nativeTextTail || target.compilationGroup || target.atomicText || target.logicalFunctions
      || target.logicalFragments || target.continuationRows || target.originalAssemblyParts)
    throw new Error('executable-prefix selection cannot change producer representation');
  for (const [field, value] of Object.entries(selected)) {
    if (canonicalJson(target[field]) !== canonicalJson(value)) throw new Error('executable-prefix selection identity drift: ' + field);
  }
  const expected = baserom.subarray(selected.romStart, selected.romEndExclusive);
  if (!Buffer.isBuffer(target.expectedBytes) || !target.expectedBytes.equals(expected)
      || target.expectedBytesSha256 !== sha256Buffer(expected)) throw new Error('executable-prefix expected bytes drift');
  if (authority.modelId && target.modelId !== authority.modelId) throw new Error('executable-prefix model identity drift');
  const live = authority.bySymbol?.get(target.symbol.toLowerCase());
  if (live && target.targetId !== live.targetId) throw new Error('executable-prefix target identity drift');
  if (authority.modelId) {
    const metadata = Object.fromEntries(Object.entries(target).filter(([key]) => ![
      ...LIVE_TARGET_FIELDS, 'expectedBytes', 'row', 'targetId', 'modelId', 'expectedBytesSha256',
    ].includes(key)));
    if (target.targetId !== digest({ modelId: authority.modelId, metadata, expectedBytesSha256: target.expectedBytesSha256 }))
      throw new Error('executable-prefix serialized target identity drift');
  }
  if (sha256File(path.join(ROOT, row.part.file)) !== row.part.sha256) throw new Error('executable-prefix original assembly drift');
}

function executablePrefixComparisonScope(target) {
  if (!['executable-prefix','registered-padding-producer'].includes(target.selectionKind)) return null;
  return { kind: target.selectionKind, entryEvidence: target.entryEvidence, sectionName: target.sectionName,
    romStart: target.romStart, romEndExclusive: target.romEndExclusive, bytes: target.bytes,
    expectedBytesSha256: target.expectedBytesSha256, originalOwner: target.originalOwner,
    fullOriginalOwnerCompared: false };
}

function originalOwnerComparison(target) {
  return ['executable-prefix','registered-padding-producer'].includes(target.selectionKind)
    ? { available: false, reason: 'retained original ASM is outside the scratch comparison' } : null;
}

function assertExecutablePrefixReportScope(target, record) {
  if (['executable-prefix','registered-padding-producer'].includes(target.selectionKind)
      && (canonicalJson(record?.comparisonScope) !== canonicalJson(executablePrefixComparisonScope(target))
        || canonicalJson(record?.originalOwnerComparison) !== canonicalJson(originalOwnerComparison(target))))
    throw new Error('cached executable-prefix comparison scope drift');
}

function compositeFunctionRows(model) {
  const eligible = (row) => row.primaryClass === 'code'
    && row.part
    && row.slices.length === 1
    && row.slices[0].executable;
  const continuations = new Map();
  const consumedRows = new Set();
  for (let rowIndex = 0; rowIndex < model.rows.length; rowIndex += 1) {
    const tail = model.rows[rowIndex];
    const stem = continuationPartStem(tail.part?.name);
    if (!stem) continue;
    const head = model.rows[rowIndex - 1];
    if (!head || !eligible(head) || !eligible(tail)
        || functionPartStem(head.part.name) !== stem
        || head.romEndExclusive !== tail.romStart
        || head.slices[0].vramEndExclusive !== tail.slices[0].vramStart
        || head.slices[0].placementKind !== tail.slices[0].placementKind
        || head.slices[0].overlayDescriptorId !== tail.slices[0].overlayDescriptorId
        || head.slices[0].loadSlabId !== tail.slices[0].loadSlabId
        || tail.part.symbolByteOffset !== 0) {
      throw new Error(`accepted continuation part does not compose with its preceding function head: ${tail.part.name}`);
    }
    if (continuations.has(head.index) || consumedRows.has(head.index) || consumedRows.has(tail.index)) {
      throw new Error(`accepted continuation part is duplicated or overlaps: ${tail.part.name}`);
    }
    continuations.set(head.index, tail);
    consumedRows.add(tail.index);
  }
  return { continuations, consumedRows };
}

function loadWorkbenchModel(options = {}) {
  const config = readJson(CONFIG_PATH);
  if (config.schemaVersion !== 1 || config.databaseSchemaVersion !== 2) throw new Error('matching workbench configuration schema drift');
  const activeModel = loadActiveTargetModel();
  const model = activeModel.model;
  const baserom = options.requireBaserom === false ? null : loadBaserom(model);
  const logicalRegistry = logical.loadRegistry(model, baserom);
  const activeBySymbol = new Map(activeModel.targets.map(target => [target.symbol.toLowerCase(), target]));
  const modelManifest = {
    schemaVersion: 1,
    targetModelContract: 7,
    multiOwnerConfig: activeModel.multiOwnerConfigIdentity,
    logicalFunctionRegistry: logicalRegistry.identity,
    logicalFunctionSemantics: [__filename, require.resolve('../logical_functions'), require.resolve('../text_contract')].map(file => ({
      path: path.relative(ROOT, file).replace(/\\/g, '/'), sha256: sha256File(file),
    })),
    profile: config.profile,
    baserom: { bytes: model.config.rom.bytes, sha256: model.config.rom.sha256 },
    conventionalBuild: {
      path: 'config/phase7/conventional-build.json',
      sha256: sha256File(PHASE7_CONFIG_PATH),
    },
    semantic: { path: 'config/splat/us_rev0.semantic.json', sha256: sha256File(SEMANTIC_PATH) },
    acceptedInputs: model.inputFiles,
  };
  const modelId = digest(modelManifest);
  const compositeRows = compositeFunctionRows(model);
  const prefixes = new Map(model.rows.filter(row => row.slices.length > 1).map(row =>
    [row.index, row.retainedPadding ? retainedPaddingSelection(activeModel,row,baserom) : executablePrefixSelection(activeModel, row, baserom)]).filter(([, value]) => value));
  let targets = model.rows
    .filter((row) => prefixes.has(row.index) || row.primaryClass === 'code' && row.part && row.slices.length === 1 && row.slices[0].executable)
    .filter((row) => !compositeRows.consumedRows.has(row.index))
    .map((row) => {
      const slice = prefixes.has(row.index) ? row.slices.find(s=>s.sectionName===prefixes.get(row.index).sectionName) : row.slices[0];
      const continuation = compositeRows.continuations.get(row.index) || null;
      const continuationSlice = continuation ? continuation.slices[0] : null;
      const symbol = continuation
        ? `func_${continuationPartStem(continuation.part.name).slice(5).toUpperCase()}`
        : row.part.name;
      const romStart = continuation ? row.romStart + row.part.symbolByteOffset : prefixes.has(row.index) ? slice.romStart : row.romStart;
      const romEndExclusive = continuation ? continuation.romEndExclusive : prefixes.has(row.index) ? slice.romEndExclusive : row.romEndExclusive;
      const bytes = romEndExclusive - romStart;
      const expected = baserom ? Buffer.from(baserom.subarray(romStart, romEndExclusive)) : null;
      const metadata = {
        schemaVersion: 1,
        symbol,
        primaryId: row.primaryId,
        rowIndex: row.index,
        romStart,
        romEndExclusive,
        bytes,
        vramStart: continuation ? slice.vramStart + row.part.symbolByteOffset : slice.vramStart,
        vramEndExclusive: continuationSlice ? continuationSlice.vramEndExclusive : slice.vramEndExclusive,
        entryVram: slice.vramStart + row.part.symbolByteOffset,
        symbolByteOffset: continuation ? 0 : row.part.symbolByteOffset,
        sectionName: slice.sectionName,
        placementKind: slice.placementKind,
        overlayDescriptorId: slice.overlayDescriptorId,
        loadSlabId: slice.loadSlabId,
        originalAssembly: row.part.file,
        originalAssemblySha256: row.part.sha256,
        ...(prefixes.get(row.index) || {}),
        ...(continuation ? {
          continuationRows: [continuation.index],
          ownerSymbolByteOffset: row.part.symbolByteOffset,
          originalAssemblyParts: [row, continuation].map((partRow) => ({
            rowIndex: partRow.index,
            symbol: partRow.part.name,
            file: partRow.part.file,
            sha256: partRow.part.sha256,
            romStart: partRow.romStart,
            romEndExclusive: partRow.romEndExclusive,
          })),
          sectionNames: [slice.sectionName, continuationSlice.sectionName],
        } : {}),
      };
      const targetId = digest({ modelId, metadata, expectedBytesSha256: expected ? sha256Buffer(expected) : null });
      const active = resolveWorkbenchActiveTarget([...activeBySymbol.values()], metadata);
      return {
        ...metadata,
        activeMatchingSource: active?.source || null,
        activeMatchingProducer: producerView(active),
        scratchCompilation: scratchCapability({ activeTargetsBySymbol: activeBySymbol }, metadata),
        targetId,
        modelId,
        expectedBytes: expected,
        expectedBytesSha256: expected ? sha256Buffer(expected) : null,
        row,
      };
    });
  // Preserve owner/history names. Complete logical bodies crossing physical
  // cuts are explicitly scratch selections, never new linker owners.
  const corrections = logicalRegistry.bodies.filter(body => body.aliases.length);
  const consumed = new Set();
  for (const body of corrections) {
    const selected = targets.find(target => target.romStart === body.romStart)
      || targets.find(target => body.aliases.some(alias => alias.toLowerCase() === target.symbol.toLowerCase()));
    if (!selected) throw new Error(`logical correction has no historical target: ${body.symbol}`);
    for (const other of targets) if (other !== selected && other.romStart >= body.romStart && other.romStart < body.romEndExclusive) consumed.add(other);
    const first = body.fragments[0], last = body.fragments[body.fragments.length - 1];
    Object.assign(selected, { selectionKind: 'logical-body', romStart: body.romStart,
      romEndExclusive: body.romEndExclusive, bytes: body.romEndExclusive - body.romStart,
      vramStart: first.vramStart, vramEndExclusive: last.vramStart + last.bytes,
      entryVram: first.vramStart, symbolByteOffset: 0, logicalAliases: [body.symbol, ...body.aliases],
      logicalFragments: body.fragments,
      expectedBytes: baserom ? Buffer.from(baserom.subarray(body.romStart, body.romEndExclusive)) : null,
      expectedBytesSha256: baserom ? body.expectedBytesSha256 : null });
  }
  targets = targets.filter(target => !consumed.has(target));
  for (const target of targets) {
    if (target.selectionKind || target.activeMatchingProducer) continue;
    const covered = logical.coverage(logicalRegistry, target.romStart, target.romEndExclusive, baserom);
    const full = logicalRegistry.bodies.filter(body => body.romStart >= target.romStart && body.romEndExclusive <= target.romEndExclusive);
    const entryBody = logicalRegistry.bodies.find(body => body.romStart <= target.entryVram - target.vramStart + target.romStart
      && body.romEndExclusive > target.entryVram - target.vramStart + target.romStart);
    const body = full.length === 1 && covered.every(piece => piece.kind !== 'unknown') ? full[0]
      : full.length === 0 && entryBody ? entryBody : null;
    if (!body || body.romStart === target.romStart && body.romEndExclusive === target.romEndExclusive) continue;
    const first = body.fragments[0], last = body.fragments[body.fragments.length - 1];
    Object.assign(target, { selectionKind: 'logical-body', physicalEnvelope: { romStart: target.romStart, romEndExclusive: target.romEndExclusive, coverage: covered },
      romStart: body.romStart, romEndExclusive: body.romEndExclusive, bytes: body.romEndExclusive - body.romStart,
      vramStart: first.vramStart, vramEndExclusive: last.vramStart + last.bytes, entryVram: first.vramStart,
      symbolByteOffset: 0, logicalFragments: body.fragments,
      expectedBytes: baserom ? Buffer.from(baserom.subarray(body.romStart, body.romEndExclusive)) : null,
      expectedBytesSha256: baserom ? body.expectedBytesSha256 : null });
  }
  for (const target of targets) {
    const relevant = logicalRegistry.bodies.filter(body => body.romStart < target.romEndExclusive && body.romEndExclusive > target.romStart);
    if (target.selectionKind === 'registered-padding-producer') continue;
    if (target.selectionKind === 'executable-prefix' && relevant.length) throw new Error('executable-prefix selection overlaps logical-function metadata');
    if (relevant.length) {
      target.logicalCoverage = logical.coverage(logicalRegistry, target.romStart, target.romEndExclusive, baserom);
      target.logicalFunctions = relevant.filter(body => body.romStart >= target.romStart && body.romEndExclusive <= target.romEndExclusive)
        .map((body, index) => ({ symbol: index === 0 ? target.symbol : body.symbol,
          romStart: body.romStart, romEndExclusive: body.romEndExclusive,
          offset: body.romStart - target.romStart, bytes: body.romEndExclusive - body.romStart,
          evidence: body.evidence, fragments: body.fragments }));
      target.logicalCoverageComplete = target.logicalCoverage.every(piece => ['function','padding'].includes(piece.kind));
      target.selectionKind ||= 'physical-owner-envelope';
    }
    const record = Object.fromEntries(Object.entries(target).filter(([key]) => ![
      ...LIVE_TARGET_FIELDS, 'expectedBytes', 'row', 'targetId', 'modelId', 'expectedBytesSha256',
    ].includes(key)));
    target.targetId = digest({ modelId, metadata: record, expectedBytesSha256: target.expectedBytesSha256 });
  }
  const bySymbol = new Map();
  for (const target of targets) {
    const key = target.symbol.toLowerCase();
    if (bySymbol.has(key)) throw new Error(`accepted function symbol is duplicated: ${target.symbol}`);
    bySymbol.set(key, target);
  }
  for (const target of targets) for (const alias of target.logicalAliases || []) {
    const key = alias.toLowerCase();
    if (bySymbol.has(key) && bySymbol.get(key) !== target) throw new Error(`logical alias collides: ${alias}`);
    bySymbol.set(key, target);
  }
  const logicalTargets = [];
  for (const body of logicalRegistry.bodies) {
    if (bySymbol.has(body.symbol.toLowerCase())) continue;
    const enclosing = targets.find(target => target.romStart === body.romStart);
    if (enclosing?.selectionKind === 'logical-body' && enclosing.romEndExclusive !== body.romEndExclusive) {
      throw new Error(`logical body alias extent differs: ${body.symbol}`);
    }
    if (enclosing) { bySymbol.set(body.symbol.toLowerCase(), enclosing); continue; }
    const first = body.fragments[0], last = body.fragments[body.fragments.length - 1];
    const row = model.rows.find(row => row.index === first.rowIndex);
    const metadata = { schemaVersion: 1, symbol: body.symbol, selectionKind: 'logical-body',
      primaryId: row.primaryId, rowIndex: row.index, romStart: body.romStart, romEndExclusive: body.romEndExclusive,
      bytes: body.romEndExclusive - body.romStart, vramStart: first.vramStart,
      vramEndExclusive: last.vramStart + last.bytes, entryVram: first.vramStart, symbolByteOffset: 0,
      sectionName: first.sectionName, placementKind: first.placementKind, overlayDescriptorId: first.overlayDescriptorId,
      loadSlabId: first.loadSlabId, originalAssembly: first.file, originalAssemblySha256: first.sha256,
      logicalFragments: body.fragments, logicalFunctions: [{ symbol: body.symbol, romStart: body.romStart,
        romEndExclusive: body.romEndExclusive, offset: 0, bytes: body.romEndExclusive - body.romStart, evidence: body.evidence, fragments: body.fragments }],
      logicalCoverage: logical.coverage(logicalRegistry, body.romStart, body.romEndExclusive, baserom), logicalCoverageComplete: true };
    const target = { ...metadata, modelId, row, expectedBytesSha256: baserom ? body.expectedBytesSha256 : null,
      expectedBytes: baserom ? Buffer.from(baserom.subarray(body.romStart, body.romEndExclusive)) : null,
      targetId: digest({ modelId, metadata, expectedBytesSha256: baserom ? body.expectedBytesSha256 : null }),
      activeMatchingSource: null, activeMatchingProducer: null };
    target.scratchCompilation = scratchCapability({ activeTargetsBySymbol: activeBySymbol }, target);
    logicalTargets.push(target); bySymbol.set(body.symbol.toLowerCase(), target);
  }
  for (const target of targets) target.scratchCompilation = scratchCapability({ activeTargetsBySymbol: activeBySymbol }, target);
  return { config, model, modelId, modelManifest, baserom, targets, logicalTargets, bySymbol, logicalRegistry,
    multiOwnerContracts: activeModel.multiOwnerContracts, multiOwnerConfigIdentity: activeModel.multiOwnerConfigIdentity,
    activeTargetsBySymbol: activeBySymbol };
}

function resolveTarget(workbench, symbol) {
  const target = workbench.bySymbol.get(String(symbol).toLowerCase());
  if (!target) throw new Error(`accepted function target does not resolve uniquely: ${symbol}`);
  return String(symbol) === target.symbol ? target : { ...target, requestedSymbol: String(symbol) };
}

function historicalSymbols(target) {
  return [...new Set([target.symbol, ...(target.logicalAliases || []), target.requestedSymbol].filter(Boolean).map(symbol => symbol.toLowerCase()))];
}

function targetRecord(target, observedAt = new Date().toISOString()) {
  if (!target.expectedBytes) throw new Error('target record requires canonical expected bytes');
  const metadata = Object.fromEntries(Object.entries(target).filter(([key]) => ![
    ...LIVE_TARGET_FIELDS, 'expectedBytes', 'row', 'targetId', 'modelId', 'expectedBytesSha256',
  ].includes(key)));
  return {
    targetId: target.targetId,
    modelId: target.modelId,
    symbol: target.symbol,
    metadata: { ...metadata, expectedBytesSha256: target.expectedBytesSha256 },
    expectedBytes: target.expectedBytes.toString('base64'),
    observedAt,
  };
}

function publicTarget(target) {
  return {
    symbol: target.symbol,
    targetId: target.targetId,
    modelId: target.modelId,
    primaryId: target.primaryId,
    rowIndex: target.rowIndex,
    rom: `${hex(target.romStart)}..${hex(target.romEndExclusive)}`,
    bytes: target.bytes,
    vram: `${hex(target.vramStart)}..${hex(target.vramEndExclusive)}`,
    entryVram: hex(target.entryVram),
    symbolByteOffset: target.symbolByteOffset,
    placementKind: target.placementKind,
    overlayDescriptorId: target.overlayDescriptorId,
    loadSlabId: target.loadSlabId,
    sectionName: target.sectionName,
    originalAssembly: target.originalAssembly,
    ...(target.originalAssemblyParts ? { originalAssemblyParts: target.originalAssemblyParts } : {}),
    expectedBytesSha256: target.expectedBytesSha256,
    activeMatchingSource: target.activeMatchingSource,
    activeMatchingProducer: target.activeMatchingProducer,
    scratchCompilation: target.scratchCompilation,
    selectionKind: target.selectionKind,
    ...(target.entryEvidence ? { entryEvidence: target.entryEvidence } : {}),
    ...(target.originalOwner ? { originalOwner: target.originalOwner, comparisonScope: executablePrefixComparisonScope(target),
      originalOwnerComparison: originalOwnerComparison(target) } : {}),
    logicalFunctions: target.logicalFunctions,
    logicalCoverage: target.logicalCoverage,
    logicalCoverageComplete: target.logicalCoverageComplete,
    logicalAliases: target.logicalAliases,
    requestedSymbol: target.requestedSymbol,
    ordinaryMatchingEligible: target.symbolByteOffset === 0 && target.selectionKind !== 'logical-body' && target.logicalCoverageComplete !== false,
  };
}

module.exports = {
  retainedPaddingSelection, executablePrefixSelection, assertExecutablePrefixSelection, executablePrefixComparisonScope, originalOwnerComparison,
  assertExecutablePrefixReportScope,
  historicalSymbols,
  LIVE_TARGET_FIELDS, assertScratchCapability, isActiveTarget, producerView, scratchCapability,
  ACTIVE_PATH,
  BASEROM_PATH,
  CONFIG_PATH,
  SEMANTIC_PATH,
  canonicalJson,
  digest,
  hex,
  loadWorkbenchModel,
  publicTarget,
  resolveTarget,
  targetRecord,
};
