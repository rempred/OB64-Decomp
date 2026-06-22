/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005CEBC..0x0005CEC4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8-byte index/display-order table: bytes {07 02 06 03 05 04 01 00} (a permutation of 0..7), preceding the pointer table at 0x5CEC4 [adv-review: was mis-included as rodata string pad]. */
/* 0x0005CEBC 0x800CCABC 0x07020603 */ .word 0x07020603 # bltzl $t8, 0x800CE2CC
/* 0x0005CEC0 0x800CCAC0 0x05040100 */ .word 0x05040100 # regimm_0x04 $t0, 0x800CCEC4
