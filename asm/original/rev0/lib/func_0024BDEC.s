/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024BDEC..0x0024BE1C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent-missed frameless FP scale leaf. lui 0x4218 (152.0) div.s $f12; lui 0x3F80 (1.0) add.s bias; trunc.w.s; mfc1 $v0. jr$ra@0x0024BE14 + delay nop@0x0024BE18. FP is CODE. */
/* 0x0024BDEC 0x802BB9EC 0x3C014218 */ .word 0x3C014218 # lui $at, 0x4218
/* 0x0024BDF0 0x802BB9F0 0x44810000 */ .word 0x44810000 # mtc1 $at, $f0
/* 0x0024BDF4 0x802BB9F4 0x00000000 */ .word 0x00000000 # nop
/* 0x0024BDF8 0x802BB9F8 0x46006303 */ .word 0x46006303 # div.s $f12, $f12, $f0
/* 0x0024BDFC 0x802BB9FC 0x3C013F80 */ .word 0x3C013F80 # lui $at, 0x3F80
/* 0x0024BE00 0x802BBA00 0x44810000 */ .word 0x44810000 # mtc1 $at, $f0
/* 0x0024BE04 0x802BBA04 0x00000000 */ .word 0x00000000 # nop
/* 0x0024BE08 0x802BBA08 0x46006300 */ .word 0x46006300 # add.s $f12, $f12, $f0
/* 0x0024BE0C 0x802BBA0C 0x4600600D */ .word 0x4600600D # trunc.w.s $f0, $f12
/* 0x0024BE10 0x802BBA10 0x44020000 */ .word 0x44020000 # mfc1 $v0, $f0
/* 0x0024BE14 0x802BBA14 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024BE18 0x802BBA18 0x00000000 */ .word 0x00000000 # nop
