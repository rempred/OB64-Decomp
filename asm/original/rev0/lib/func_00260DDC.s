/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x00260DDC..0x00260E00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan: TRUE entry is the read-before-write preamble at 0x00260DDC (lui$a0,0x8022 / lw$a0,0xF20($a0)) whose $a0 is consumed by jal 0x800712C4 in the addiu$sp,-0x18 body at 0x00260DE4 before any write to $a0. Named for the PART START. jr$ra@0x00260DF8 + delay addiu$sp,0x18@0x00260DFC. */
func_00260DDC:
/* 0x00260DDC 0x802D09DC 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00260DE0 0x802D09E0 0x8C840F20 */ .word 0x8C840F20 # lw $a0, 0xF20($a0)

/* function boundary candidate: func_00260DE4, size=28, kind=prologue */
func_00260DE4:
/* 0x00260DE4 0x802D09E4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00260DE8 0x802D09E8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00260DEC 0x802D09EC 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00260DF0 0x802D09F0 0x00000000 */ .word 0x00000000 # nop
/* 0x00260DF4 0x802D09F4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00260DF8 0x802D09F8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00260DFC 0x802D09FC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
