/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024BDBC..0x0024BDEC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent-missed frameless FP scale leaf. lui 0x4218 (152.0) mtc1 $f0; div.s $f12/$f0; lui 0x4080 (4.0) add.s bias; trunc.w.s; mfc1 $v0. jr$ra@0x0024BDE4 + delay nop@0x0024BDE8. FP is CODE. */
/* 0x0024BDBC 0x802BB9BC 0x3C014218 */ .word 0x3C014218 # lui $at, 0x4218
/* 0x0024BDC0 0x802BB9C0 0x44810000 */ .word 0x44810000 # mtc1 $at, $f0
/* 0x0024BDC4 0x802BB9C4 0x00000000 */ .word 0x00000000 # nop
/* 0x0024BDC8 0x802BB9C8 0x46006303 */ .word 0x46006303 # div.s $f12, $f12, $f0
/* 0x0024BDCC 0x802BB9CC 0x3C014080 */ .word 0x3C014080 # lui $at, 0x4080
/* 0x0024BDD0 0x802BB9D0 0x44810000 */ .word 0x44810000 # mtc1 $at, $f0
/* 0x0024BDD4 0x802BB9D4 0x00000000 */ .word 0x00000000 # nop
/* 0x0024BDD8 0x802BB9D8 0x46006300 */ .word 0x46006300 # add.s $f12, $f12, $f0
/* 0x0024BDDC 0x802BB9DC 0x4600600D */ .word 0x4600600D # trunc.w.s $f0, $f12
/* 0x0024BDE0 0x802BB9E0 0x44020000 */ .word 0x44020000 # mfc1 $v0, $f0
/* 0x0024BDE4 0x802BB9E4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024BDE8 0x802BB9E8 0x00000000 */ .word 0x00000000 # nop
