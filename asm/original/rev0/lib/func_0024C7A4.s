/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024C7A4..0x0024C7D8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (plan-missed): vector subtract reading $a1,$a2 -> $a0 via three lwc1/sub.s/swc1 pairs (offsets 0/4/8). Non-prologue entry after prior delay slot. jr $ra at 0x0024C7D0 + delay (swc1 $f0,8($a0)) at 0x0024C7D4. */
/* 0x0024C7A4 0x802BC3A4 0xC4A00000 */ .word 0xC4A00000 # lwc1 $f0, 0x0($a1)
/* 0x0024C7A8 0x802BC3A8 0xC4C20000 */ .word 0xC4C20000 # lwc1 $f2, 0x0($a2)
/* 0x0024C7AC 0x802BC3AC 0x46020001 */ .word 0x46020001 # sub.s $f0, $f0, $f2
/* 0x0024C7B0 0x802BC3B0 0xE4800000 */ .word 0xE4800000 # swc1 $f0, 0x0($a0)
/* 0x0024C7B4 0x802BC3B4 0xC4A00004 */ .word 0xC4A00004 # lwc1 $f0, 0x4($a1)
/* 0x0024C7B8 0x802BC3B8 0xC4C20004 */ .word 0xC4C20004 # lwc1 $f2, 0x4($a2)
/* 0x0024C7BC 0x802BC3BC 0x46020001 */ .word 0x46020001 # sub.s $f0, $f0, $f2
/* 0x0024C7C0 0x802BC3C0 0xE4800004 */ .word 0xE4800004 # swc1 $f0, 0x4($a0)
/* 0x0024C7C4 0x802BC3C4 0xC4A00008 */ .word 0xC4A00008 # lwc1 $f0, 0x8($a1)
/* 0x0024C7C8 0x802BC3C8 0xC4C20008 */ .word 0xC4C20008 # lwc1 $f2, 0x8($a2)
/* 0x0024C7CC 0x802BC3CC 0x46020001 */ .word 0x46020001 # sub.s $f0, $f0, $f2
/* 0x0024C7D0 0x802BC3D0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024C7D4 0x802BC3D4 0xE4800008 */ .word 0xE4800008 # swc1 $f0, 0x8($a0)
