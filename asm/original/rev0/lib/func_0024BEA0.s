/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024BEA0..0x0024BECC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf (plan over-merged into idx3). Polynomial/table-step: addiu -0x2F; bltzl branch; sra/sll chain (*0x4*0x5*0x2-... = scaled index); jr$ra@0x0024BEC4 + delay addiu $v0,$v0,-0xAB@0x0024BEC8. Reads $a0. */
/* 0x0024BEA0 0x802BBAA0 0x2483FFD1 */ .word 0x2483FFD1 # addiu $v1, $a0, -0x2F
/* 0x0024BEA4 0x802BBAA4 0x04620001 */ .word 0x04620001 # bltzl $v1, 0x802BBAAC
/* 0x0024BEA8 0x802BBAA8 0x2483FFD4 */ .word 0x2483FFD4 # addiu $v1, $a0, -0x2C
/* 0x0024BEAC 0x802BBAAC 0x00031883 */ .word 0x00031883 # sra $v1, $v1, 2
/* 0x0024BEB0 0x802BBAB0 0x00031080 */ .word 0x00031080 # sll $v0, $v1, 2
/* 0x0024BEB4 0x802BBAB4 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0024BEB8 0x802BBAB8 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x0024BEBC 0x802BBABC 0x00431023 */ .word 0x00431023 # subu $v0, $v0, $v1
/* 0x0024BEC0 0x802BBAC0 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x0024BEC4 0x802BBAC4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024BEC8 0x802BBAC8 0x2442FF55 */ .word 0x2442FF55 # addiu $v0, $v0, -0xAB
