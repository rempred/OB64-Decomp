/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x00237E18..0x00237E2C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf recovered (plan missed). sll$v0,$a1,1; addu$v0,$v0,$a1; addiu$a0,$a0,0x14; jr$ra; addu$v0,$v0,$a0 (delay). Tiny *3+ table-index helper, no stack frame. */
/* 0x00237E18 0x802A7A18 0x00051040 */ .word 0x00051040 # sll $v0, $a1, 1
/* 0x00237E1C 0x802A7A1C 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00237E20 0x802A7A20 0x24840014 */ .word 0x24840014 # addiu $a0, $a0, 0x14
/* 0x00237E24 0x802A7A24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00237E28 0x802A7A28 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
