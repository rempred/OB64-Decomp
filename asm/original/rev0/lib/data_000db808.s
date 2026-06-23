/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DB808..0x000DB860 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Value block: 11 ascending big-endian u32 cumulative offsets 0x09E0,0x2360,0x3620,0x40C0,0x4B88,0x5790,0x6630,0x7380,0x7CB8,0x86B8,0x9EE8 (monotonic, look like byte offsets into a data segment) @DB808-DB834, followed by 10 u16 (w,h)-style pairs 0x0040/0x0066, 0x0040/0x004B, 0x0028/0x0044 ... @DB834-DB860. Hypothesis: a size/offset directory.. */
/* 0x000DB808 0x8014B408 0x000009E0 */ .word 0x000009E0 # add $at, $zero, $zero
/* 0x000DB80C 0x8014B40C 0x00002360 */ .word 0x00002360 # add $a0, $zero, $zero
/* 0x000DB810 0x8014B410 0x00003620 */ .word 0x00003620 # add $a2, $zero, $zero
/* 0x000DB814 0x8014B414 0x000040C0 */ .word 0x000040C0 # sll $t0, $zero, 3
/* 0x000DB818 0x8014B418 0x00004B88 */ .word 0x00004B88 # jr $zero
/* 0x000DB81C 0x8014B41C 0x00005790 */ .word 0x00005790 # mfhi $t2
/* 0x000DB820 0x8014B420 0x00006630 */ .word 0x00006630 # tge $zero, $zero
/* 0x000DB824 0x8014B424 0x00007380 */ .word 0x00007380 # sll $t6, $zero, 14
/* 0x000DB828 0x8014B428 0x00007CB8 */ .word 0x00007CB8 # dsll $t7, $zero, 18
/* 0x000DB82C 0x8014B42C 0x000086B8 */ .word 0x000086B8 # dsll $s0, $zero, 26
/* 0x000DB830 0x8014B430 0x00009EE8 */ .word 0x00009EE8 # special_0x28
/* 0x000DB834 0x8014B434 0x00400066 */ .word 0x00400066 # xor $zero, $v0, $zero
/* 0x000DB838 0x8014B438 0x0040004B */ .word 0x0040004B # special_0x0B
/* 0x000DB83C 0x8014B43C 0x00280044 */ .word 0x00280044 # sllv $zero, $t0, $at
/* 0x000DB840 0x8014B440 0x00280045 */ .word 0x00280045 # special_0x05
/* 0x000DB844 0x8014B444 0x0028004D */ .word 0x0028004D # break 0x0A001
/* 0x000DB848 0x8014B448 0x0030004E */ .word 0x0030004E # special_0x0E
/* 0x000DB84C 0x8014B44C 0x00300047 */ .word 0x00300047 # srav $zero, $s0, $at
/* 0x000DB850 0x8014B450 0x0028003B */ .word 0x0028003B # dsra $zero, $t0, 0
/* 0x000DB854 0x8014B454 0x00280040 */ .word 0x00280040 # sll $zero, $t0, 1
/* 0x000DB858 0x8014B458 0x00480056 */ .word 0x00480056 # dsrlv $zero, $t0, $v0
/* 0x000DB85C 0x8014B45C 0x00400066 */ .word 0x00400066 # xor $zero, $v0, $zero
