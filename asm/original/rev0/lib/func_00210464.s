/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00210464..0x0021048C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (sum loop, slt/addu). jr$ra@0x00210484 + delay move $v0,$v1@0x00210488. */
/* 0x00210464 0x80280064 0x0085102A */ .word 0x0085102A # slt $v0, $a0, $a1
/* 0x00210468 0x80280068 0x14400006 */ .word 0x14400006 # bne $v0, $zero, 0x80280084
/* 0x0021046C 0x8028006C 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00210470 0x80280070 0x00641821 */ .word 0x00641821 # addu $v1, $v1, $a0
/* 0x00210474 0x80280074 0x2484FFFF */ .word 0x2484FFFF # addiu $a0, $a0, -0x1
/* 0x00210478 0x80280078 0x0085102A */ .word 0x0085102A # slt $v0, $a0, $a1
/* 0x0021047C 0x8028007C 0x5040FFFD */ .word 0x5040FFFD # beql $v0, $zero, 0x80280074
/* 0x00210480 0x80280080 0x00641821 */ .word 0x00641821 # addu $v1, $v1, $a0
/* 0x00210484 0x80280084 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00210488 0x80280088 0x00601021 */ .word 0x00601021 # move $v0, $v1
