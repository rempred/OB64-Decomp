/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024478C..0x002447A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 1 zero pad word then IEEE double-constant tail: 0x4056800000000000=90.0 and 0x4024000000000000=10.0 (each as 8-byte double with zero low word). Trailing double constants closing the island.. */
/* 0x0024478C 0x802B438C 0x00000000 */ .word 0x00000000 # nop
/* 0x00244790 0x802B4390 0x40568000 */ .word 0x40568000 # cop0_0x02
/* 0x00244794 0x802B4394 0x00000000 */ .word 0x00000000 # nop
/* 0x00244798 0x802B4398 0x40240000 */ .word 0x40240000 # cop0_0x01
/* 0x0024479C 0x802B439C 0x00000000 */ .word 0x00000000 # nop
