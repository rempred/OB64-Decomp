#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { verifyPhase5aProduct } = require('./lib/phase5b_phase5a');

const ROOT = path.resolve(__dirname, '..');
const PRODUCT = path.join(ROOT, 'docs', 'external-intake', 'phase5-boundary-segment-reconciliation-static-20260731');
const EXPECTED = {
  phase5aProductSha256: '13BB110109C6DAE45157572DB5AC95DD233AB41C8639901302ED593AAB862EF2',
  overlayConfigSha256: 'D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6',
  rows: 7242,
  bytes: 41943040,
  unresolvedSegments: 5,
  unresolvedFunctions: 6154,
};

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function jsonl(file) {
  return fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function hex(value) {
  return `0x${value.toString(16).toUpperCase().padStart(8, '0')}`;
}

function safe(value) {
  return String(value).replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function typeFor() {
  // Phase 5A proves no-gap ROM ownership. It does not assign one VRAM value to
  // every overlay-relocated primary row, so an `asm` segment would fabricate a
  // linker placement. Neutral binary extraction preserves the accepted class
  // without promoting a function or overlay mapping.
  return 'bin';
}

function readInputs(product) {
  const accepted = verifyPhase5aProduct(product);
  const ledgerFile = path.join(product, 'full-rom-primary-ledger.jsonl');
  const segmentFile = path.join(product, 'segment-dispositions.jsonl');
  const functionFile = path.join(product, 'function-dispositions.jsonl');
  const overlayFile = path.join(product, 'overlay-containment.jsonl');
  const ledger = jsonl(ledgerFile);
  const unresolvedSegments = jsonl(segmentFile).filter((row) => row.disposition === 'unresolved');
  const unresolvedFunctions = jsonl(functionFile).filter((row) => row.disposition === 'unresolved');
  const overlays = jsonl(overlayFile);
  let cursor = 0;
  for (const row of ledger) {
    if (row.rom_start !== cursor || row.rom_end_exclusive <= row.rom_start || row.bytes !== row.rom_end_exclusive - row.rom_start) {
      throw new Error(`Accepted primary ledger is not contiguous at ${row.id}`);
    }
    cursor = row.rom_end_exclusive;
  }
  if (ledger.length !== EXPECTED.rows || cursor !== EXPECTED.bytes) throw new Error('Accepted primary ledger conservation differs from the Phase 5A contract');
  if (unresolvedSegments.length !== EXPECTED.unresolvedSegments) throw new Error('Accepted unresolved segment count differs from the Phase 5A contract');
  if (unresolvedFunctions.length !== EXPECTED.unresolvedFunctions) throw new Error('Accepted unresolved function count differs from the Phase 5A contract');
  const overlayFilePath = path.join(ROOT, 'config', 'overlays', 'us_rev0.json');
  if (sha256(overlayFilePath) !== EXPECTED.overlayConfigSha256) throw new Error('Accepted Phase 4 overlay configuration drifted');
  return {
    ledger,
    unresolvedSegments,
    unresolvedFunctions,
    overlays,
    inputHashes: {
      primaryLedger: sha256(ledgerFile),
      segmentDispositions: sha256(segmentFile),
      functionDispositions: sha256(functionFile),
      overlayContainment: sha256(overlayFile),
      phase4OverlayConfig: sha256(overlayFilePath),
    },
    accepted,
  };
}

function render(inputs) {
  const rows = inputs.ledger.map((row) => ({
    index: row.index,
    primaryId: row.id,
    romStart: row.rom_start,
    romEndExclusive: row.rom_end_exclusive,
    bytes: row.bytes,
    primaryClass: row.primary_class,
    sourceForm: row.source_form,
    ownerKind: row.owner_kind,
    ambiguous: row.ambiguous,
    processorClass: /\/rsp_ucode_/i.test(row.owner_path) ? 'rsp' : 'cpu-or-non-cpu',
    segmentType: typeFor(row),
    name: `p${String(row.index).padStart(4, '0')}_${safe(row.primary_class)}_${safe(row.source_form)}_${hex(row.rom_start).slice(2).toLowerCase()}_${hex(row.rom_end_exclusive).slice(2).toLowerCase()}`,
  }));
  const semantic = {
    schemaVersion: 1,
    generator: 'tools/generate_phase5b_production_config.js',
    acceptedPhase5a: {
      productSha256: EXPECTED.phase5aProductSha256,
      primaryRows: EXPECTED.rows,
      representedBytes: EXPECTED.bytes,
      unresolvedSegmentCandidates: EXPECTED.unresolvedSegments,
      unresolvedFunctionCandidates: EXPECTED.unresolvedFunctions,
    },
    acceptedPhase4: { overlayConfigSha256: EXPECTED.overlayConfigSha256, overlayRows: inputs.overlays.length },
    inputHashes: inputs.inputHashes,
    unresolvedSegmentCandidates: inputs.unresolvedSegments.map((row) => ({
      candidateId: row.candidate_id,
      addressSpace: row.address_space,
      start: row.start,
      end: row.end,
      disposition: row.disposition,
    })),
    rows,
  };
  // This sidecar is deliberately not a conventional Splat `vram` setting.
  // Phase 4 proves overlapping overlay reservations, while Splat's `asm`
  // segments require one scalar placement per row.  Keeping the reservations
  // separate preserves their true ROM/VRAM relationship without inventing one.
  const overlayLinkerInputs = {
    schemaVersion: 1,
    generator: 'tools/generate_phase5b_production_config.js',
    mode: 'primary-rom-only-with-explicit-phase4-overlay-reservations',
    phase4OverlayConfigSha256: EXPECTED.overlayConfigSha256,
    phase5aProductSha256: EXPECTED.phase5aProductSha256,
    splatPrimaryRows: rows.map((row) => ({
      index: row.index,
      primaryId: row.primaryId,
      name: row.name,
      romStart: row.romStart,
      romEndExclusive: row.romEndExclusive,
      bytes: row.bytes,
    })),
    overlayReservations: inputs.overlays,
  };
  const segmentLines = [
    '# GENERATED FILE. DO NOT EDIT.',
    '# Generated by tools/generate_phase5b_production_config.js from accepted Phase 5A input.',
    'schema: ob64-phase5b-production-segments-v1',
    'rom:',
    '  profile: us-rev0',
    `  size: ${hex(EXPECTED.bytes)}`,
    'semantic_source: config/splat/us_rev0.semantic.json',
    `accepted_phase5a_product_sha256: ${EXPECTED.phase5aProductSha256}`,
    `accepted_phase4_overlay_config_sha256: ${EXPECTED.overlayConfigSha256}`,
    `primary_row_count: ${EXPECTED.rows}`,
    `unresolved_function_candidate_count: ${EXPECTED.unresolvedFunctions}`,
    'unresolved_segment_candidates:',
    ...semantic.unresolvedSegmentCandidates.flatMap((row) => [
      `  - candidate_id: ${row.candidateId}`,
      `    address_space: ${row.addressSpace}`,
      `    start: ${row.start === null ? 'null' : hex(row.start)}`,
      `    end: ${row.end === null ? 'null' : hex(row.end)}`,
      '    disposition: unresolved',
    ]),
    'segments:',
    ...rows.flatMap((row) => [
      `  - index: ${row.index}`,
      `    primary_id: ${row.primaryId}`,
      `    name: ${row.name}`,
      `    source_class: ${row.sourceForm}`,
      `    primary_class: ${row.primaryClass}`,
      `    owner_kind: ${row.ownerKind}`,
      `    processor_class: ${row.processorClass}`,
      `    ambiguous: ${row.ambiguous ? 'true' : 'false'}`,
      `    type: ${row.segmentType}`,
      `    rom_start: ${hex(row.romStart)}`,
      `    rom_end: ${hex(row.romEndExclusive)}`,
    ]),
    '',
  ];
  const splatLines = [
    '# GENERATED FILE. DO NOT EDIT.',
    '# The relative paths intentionally bind only in an isolated execution root.',
    'name: ob64_us_rev0_phase5b',
    'sha1: 9CD0CFB50B883EDB068E0C30D213193B9CF89895',
    'options:',
    '  basename: ob64_us_rev0_phase5b',
    '  base_path: .',
    '  target_path: baserom.us_rev0.z64',
    '  platform: n64',
    '  compiler: IDO',
    '  endianness: big',
    '  asm_path: asm',
    '  asset_path: assets',
    '  src_path: src',
    '  build_path: build',
    '  cache_path: .splat-cache',
    '  create_undefined_funcs_auto: false',
    '  create_undefined_syms_auto: false',
    '  ld_script_path: build/ob64_us_rev0_phase5b.ld',
    '  ld_symbol_header_path: include/ob64_us_rev0_phase5b_segments.h',
    '  ld_generate_symbol_per_data_segment: true',
    '  ld_use_symbolic_vram_addresses: false',
    '  ld_discard_section: false',
    'segments:',
    ...rows.flatMap((row) => [
      `  - name: ${row.name}`,
      `    type: ${row.segmentType}`,
      `    start: ${hex(row.romStart)}`,
      `    end: ${hex(row.romEndExclusive)}`,
    ]),
    `  - [${hex(EXPECTED.bytes)}]`,
    '',
  ];
  return {
    'config/segments/rev0.yaml': segmentLines.join('\n'),
    'config/splat/us_rev0.semantic.json': `${JSON.stringify(semantic, null, 2)}\n`,
    'config/splat/us_rev0.overlay-linker-inputs.json': `${JSON.stringify(overlayLinkerInputs, null, 2)}\n`,
    'config/splat/us_rev0.yaml': splatLines.join('\n'),
  };
}

function main() {
  const check = process.argv.includes('--check');
  const i = process.argv.indexOf('--phase5a-root');
  const product = i >= 0 ? path.resolve(process.argv[i + 1]) : PRODUCT;
  if (i >= 0 && !process.argv[i + 1]) throw new Error('Missing --phase5a-root value');
  const inputs = readInputs(product);
  const outputs = render(inputs);
  const mismatches = [];
  for (const [relative, text] of Object.entries(outputs)) {
    const target = path.join(ROOT, relative);
    if (check) {
      if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== text) mismatches.push(relative);
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, text);
    }
  }
  if (check && mismatches.length) throw new Error(`Generated Phase 5B configuration drift: ${mismatches.join(', ')}`);
  console.log(`Phase 5B production configuration ${check ? 'matches' : 'generated'}: ${EXPECTED.rows} primary rows, ${EXPECTED.bytes} bytes`);
}

main();
