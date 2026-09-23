'use strict';

// Pure-helper regression fixtures for the template-reuse placement-qualified
// link check (tools/matching_studies/template_reuse/link_check.js).  No
// compiler, ROM, or build artifact is needed.  Fixtures 1-4 reproduce the
// independent review's false positives in the earlier helper; each must now
// be rejected.  Positive controls confirm correct references still pass.

const assert = require('assert');
const { linkCheck, makeResolver } = require('../tools/matching_studies/template_reuse/link_check');

const w = (...hex) => hex.map((h) => Number.parseInt(h, 16) >>> 0);
const staticTarget = { placementKind: 'early-boot-linear', overlayDescriptorId: null, loadSlabId: null };
const overlayA = { placementKind: 'overlay', overlayDescriptorId: 1, loadSlabId: null };
const overlays = [{ kind: 'overlay', id: 1, vramStart: 0x80100000, vramEnd: 0x80110000 }, { kind: 'overlay', id: 2, vramStart: 0x80100000, vramEnd: 0x80120000 }];

let checks = 0;
function check(name, args, expectEqual) {
  checks++;
  const result = linkCheck(args);
  assert.strictEqual(result.equal, expectEqual, `${name}: expected equal=${expectEqual}, got ${JSON.stringify(result)}`);
  return result;
}

// 1. Unregistered data name must not authenticate itself.
check('unregistered data rejected', {
  words: w('3c080000', '25080000'),
  relocations: [{ offset: 0, type: 'R_MIPS_HI16', symbol: 'D_80012340' }, { offset: 4, type: 'R_MIPS_LO16', symbol: 'D_80012340' }],
  expectedWords: w('3c088001', '25082340'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([], []), overlays: [],
}, false);
// ... and the same reference passes once the symbol is registered.
check('registered data accepted', {
  words: w('3c080000', '25080000'),
  relocations: [{ offset: 0, type: 'R_MIPS_HI16', symbol: 'D_80012340' }, { offset: 4, type: 'R_MIPS_LO16', symbol: 'D_80012340' }],
  expectedWords: w('3c088001', '25082340'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([{ name: 'D_80012340', address: '0x80012340' }], []), overlays: [],
}, true);

// 2. R_MIPS_26 must stay inside the PC+4 256 MB region.
check('unreachable jump rejected', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'far_fn' }],
  expectedWords: w('0c000400'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([], [{ symbol: 'far_fn', entryVram: 0x90001000, placementKind: 'early-boot-linear' }]), overlays: [],
}, false);
check('reachable static call accepted', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'near_fn' }],
  expectedWords: w('0c000400'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([], [{ symbol: 'near_fn', entryVram: 0x80001000, placementKind: 'early-boot-linear' }]), overlays: [],
}, true);

// 3. A callee in a different overlay is rejected even when the address matches.
check('cross-overlay callee rejected', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'ovl_b_fn' }],
  expectedWords: w('0c000800'), entryVram: 0x80100000, target: overlayA,
  resolve: makeResolver([], [{ symbol: 'ovl_b_fn', entryVram: 0x80002000, placementKind: 'overlay', overlayDescriptorId: 2 }]), overlays,
}, false);
check('same-overlay callee accepted', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'ovl_a_fn' }],
  expectedWords: w('0c040400'), entryVram: 0x80100000, target: overlayA,
  resolve: makeResolver([], [{ symbol: 'ovl_a_fn', entryVram: 0x80101000, placementKind: 'overlay', overlayDescriptorId: 1 }]), overlays,
}, true);
check('overlay-range data from a static target rejected', {
  words: w('3c080000', '25080000'),
  relocations: [{ offset: 0, type: 'R_MIPS_HI16', symbol: 'D_80105000' }, { offset: 4, type: 'R_MIPS_LO16', symbol: 'D_80105000' }],
  expectedWords: w('3c088010', '25085000'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([{ name: 'D_80105000', address: '0x80105000' }], []), overlays,
}, false);

// 4. Each LO16 applies its own addend; a later LO16 must not reuse the first.
check('stale LO16 addend rejected', {
  words: w('3c080000', '25080010', '25090020'),
  relocations: [{ offset: 0, type: 'R_MIPS_HI16', symbol: 'x' }, { offset: 4, type: 'R_MIPS_LO16', symbol: 'x' }, { offset: 8, type: 'R_MIPS_LO16', symbol: 'x' }],
  expectedWords: w('3c088001', '25082310', '25092310'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([{ name: 'x', address: '0x80012300' }], []), overlays: [],
}, false);
check('independent LO16 addends accepted', {
  words: w('3c080000', '25080010', '25090020'),
  relocations: [{ offset: 0, type: 'R_MIPS_HI16', symbol: 'x' }, { offset: 4, type: 'R_MIPS_LO16', symbol: 'x' }, { offset: 8, type: 'R_MIPS_LO16', symbol: 'x' }],
  expectedWords: w('3c088001', '25082310', '25092320'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([{ name: 'x', address: '0x80012300' }], []), overlays: [],
}, true);
// HI16 carry: a negative low half rounds the high half up.
check('HI16 carry', {
  words: w('3c080000', '25080000'),
  relocations: [{ offset: 0, type: 'R_MIPS_HI16', symbol: 'y' }, { offset: 4, type: 'R_MIPS_LO16', symbol: 'y' }],
  expectedWords: w('3c088002', '2508a000'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([{ name: 'y', address: '0x8001A000' }], []), overlays: [],
}, true);

// Controls: wrong symbol, changed internal CFG destination, changed branch.
check('wrong callee rejected', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'other_fn' }],
  expectedWords: w('0c000400'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([], [{ symbol: 'other_fn', entryVram: 0x80003000, placementKind: 'early-boot-linear' }]), overlays: [],
}, false);
check('internal jump destination change rejected', {
  words: w('08000005'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: '.text' }],
  expectedWords: w('08000404'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([], []), overlays: [],
}, false);
check('internal jump accepted', {
  words: w('08000004'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: '.text' }],
  expectedWords: w('08000404'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([], []), overlays: [],
}, true);
check('branch offset change rejected', {
  words: w('10400004'), relocations: [], expectedWords: w('10400003'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([], []), overlays: [],
}, false);
check('unsupported relocation rejected', {
  words: w('8f880000'), relocations: [{ offset: 0, type: 'R_MIPS_GOT16', symbol: 'x' }],
  expectedWords: w('8f880000'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([{ name: 'x', address: '0x80012300' }], []), overlays: [],
}, false);
// Ambiguous function name (duplicate symbol rows) does not resolve.
check('ambiguous function name rejected', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'dup' }],
  expectedWords: w('0c000400'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([], [{ symbol: 'dup', entryVram: 0x80001000, placementKind: 'early-boot-linear' }, { symbol: 'dup', entryVram: 0x80001000, placementKind: 'early-boot-linear' }]), overlays: [],
}, false);

// Review round 2: name precedence, placement kinds, overlapping data owners.
const fnB = { symbol: 'callee', entryVram: 0x80101000, placementKind: 'overlay', overlayDescriptorId: 2 };
check('registry name does not bypass function placement', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'callee' }],
  expectedWords: w('0c040400'), entryVram: 0x80100000, target: overlayA,
  resolve: makeResolver([{ name: 'callee', address: '0x80101000' }], [fnB]), overlays,
}, false);
check('case-variant registry/function name does not bypass placement', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'Callee' }],
  expectedWords: w('0c040400'), entryVram: 0x80100000, target: overlayA,
  resolve: makeResolver([{ name: 'CALLEE', address: '0x80101000' }], [fnB]), overlays,
}, false);
check('function/registry address disagreement rejected', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'f2' }],
  expectedWords: w('0c000400'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([{ name: 'f2', address: '0x80002000' }], [{ symbol: 'f2', entryVram: 0x80001000, placementKind: 'early-boot-linear' }]), overlays: [],
}, false);
for (const kind of ['rom-only', undefined]) {
  check(`callee placement ${kind} rejected`, {
    words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'unq' }],
    expectedWords: w('0c000400'), entryVram: 0x80001000, target: staticTarget,
    resolve: makeResolver([], [{ symbol: 'unq', entryVram: 0x80001000, placementKind: kind }]), overlays: [],
  }, false);
}
check('same-slab callee accepted', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'slabfn' }],
  expectedWords: w('0c000400'), entryVram: 0x80001000,
  target: { placementKind: 'non-descriptor-load-slab', loadSlabId: 's1' },
  resolve: makeResolver([], [{ symbol: 'slabfn', entryVram: 0x80001000, placementKind: 'non-descriptor-load-slab', loadSlabId: 's1' }]), overlays: [],
}, true);
check('other-slab callee rejected', {
  words: w('0c000000'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: 'slabfn' }],
  expectedWords: w('0c000400'), entryVram: 0x80001000,
  target: { placementKind: 'non-descriptor-load-slab', loadSlabId: 's1' },
  resolve: makeResolver([], [{ symbol: 'slabfn', entryVram: 0x80001000, placementKind: 'non-descriptor-load-slab', loadSlabId: 's2' }]), overlays: [],
}, false);
check('overlapping-overlay data owner rejected', {
  words: w('3c080000', '25080000'),
  relocations: [{ offset: 0, type: 'R_MIPS_HI16', symbol: 'D_80105000' }, { offset: 4, type: 'R_MIPS_LO16', symbol: 'D_80105000' }],
  expectedWords: w('3c088010', '25085000'), entryVram: 0x80100000, target: overlayA,
  resolve: makeResolver([{ name: 'D_80105000', address: '0x80105000' }], []), overlays,
}, false);
check('uniquely covered own-overlay data accepted', {
  words: w('3c080000', '25080000'),
  relocations: [{ offset: 0, type: 'R_MIPS_HI16', symbol: 'D_80115000' }, { offset: 4, type: 'R_MIPS_LO16', symbol: 'D_80115000' }],
  expectedWords: w('3c088011', '25085000'), entryVram: 0x80100000, target: { placementKind: 'overlay', overlayDescriptorId: 2 },
  resolve: makeResolver([{ name: 'D_80115000', address: '0x80115000' }], []), overlays,
}, true);
check('duplicate registry key with different addresses rejected', {
  words: w('3c080000', '25080000'),
  relocations: [{ offset: 0, type: 'R_MIPS_HI16', symbol: 'dd' }, { offset: 4, type: 'R_MIPS_LO16', symbol: 'dd' }],
  expectedWords: w('3c088001', '25082340'), entryVram: 0x80001000, target: staticTarget,
  resolve: makeResolver([{ name: 'dd', address: '0x80012340' }, { name: 'dd', address: '0x80012344' }], []), overlays: [],
}, false);
check('rom-only target rejected', {
  words: w('08000004'), relocations: [{ offset: 0, type: 'R_MIPS_26', symbol: '.text' }],
  expectedWords: w('08000404'), entryVram: 0x80001000, target: { placementKind: 'rom-only' },
  resolve: makeResolver([], []), overlays: [],
}, false);

console.log(`template_reuse: ${checks} link-check fixtures passed`);
