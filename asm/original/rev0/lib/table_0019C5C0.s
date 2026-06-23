/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x0019C5C0..0x0019C600 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table (handler/jump-pointer array; targets are relocated 0x8021/0x8016-band code/data, NOT local-rodata string pointers). Overlay-relocated targets. RAM pointer table, 0x8021 band (16 entries). Sample values: 0x80214FCC, 0x80215348, 0x80215494, 0x802154EC, 0x8021583C, ... 0x80215FE0. Contains repeated pointers (0x80215A88 x2, 0x80215E00 x3) consistent with a pointer lookup table.. */
/* 0x0019C5C0 0x8020C1C0 0x80214FCC */ .word 0x80214FCC # lb $at, 0x4FCC($at)
/* 0x0019C5C4 0x8020C1C4 0x80215348 */ .word 0x80215348 # lb $at, 0x5348($at)
/* 0x0019C5C8 0x8020C1C8 0x80215494 */ .word 0x80215494 # lb $at, 0x5494($at)
/* 0x0019C5CC 0x8020C1CC 0x802154EC */ .word 0x802154EC # lb $at, 0x54EC($at)
/* 0x0019C5D0 0x8020C1D0 0x8021583C */ .word 0x8021583C # lb $at, 0x583C($at)
/* 0x0019C5D4 0x8020C1D4 0x8021592C */ .word 0x8021592C # lb $at, 0x592C($at)
/* 0x0019C5D8 0x8020C1D8 0x80215A00 */ .word 0x80215A00 # lb $at, 0x5A00($at)
/* 0x0019C5DC 0x8020C1DC 0x80215A88 */ .word 0x80215A88 # lb $at, 0x5A88($at)
/* 0x0019C5E0 0x8020C1E0 0x80215A88 */ .word 0x80215A88 # lb $at, 0x5A88($at)
/* 0x0019C5E4 0x8020C1E4 0x80215D14 */ .word 0x80215D14 # lb $at, 0x5D14($at)
/* 0x0019C5E8 0x8020C1E8 0x80215E00 */ .word 0x80215E00 # lb $at, 0x5E00($at)
/* 0x0019C5EC 0x8020C1EC 0x80215E00 */ .word 0x80215E00 # lb $at, 0x5E00($at)
/* 0x0019C5F0 0x8020C1F0 0x80215E00 */ .word 0x80215E00 # lb $at, 0x5E00($at)
/* 0x0019C5F4 0x8020C1F4 0x80215F10 */ .word 0x80215F10 # lb $at, 0x5F10($at)
/* 0x0019C5F8 0x8020C1F8 0x80215F60 */ .word 0x80215F60 # lb $at, 0x5F60($at)
/* 0x0019C5FC 0x8020C1FC 0x80215FE0 */ .word 0x80215FE0 # lb $at, 0x5FE0($at)
