/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x0027CDE0..0x0027CE10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan fold: 0x27CDE0 lui $a0 / 0x27CDE4 lw $a0,-0x3770($a0) load *0x8023C890, read by body at 0x27CDE8 (addiu $sp,-0x18) via beq $a0,zero before write. True entry = 0x27CDE0. jal 0x800712C4 free + clear pointer. jr $ra at 0x27CE08, delay 0x27CE0C. */
func_0027CDE0:
/* 0x0027CDE0 0x802EC9E0 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x0027CDE4 0x802EC9E4 0x8C84C890 */ .word 0x8C84C890 # lw $a0, -0x3770($a0)

/* function boundary candidate: func_0027CDE8, size=40, kind=prologue */
func_0027CDE8:
/* 0x0027CDE8 0x802EC9E8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0027CDEC 0x802EC9EC 0x10800005 */ .word 0x10800005 # beq $a0, $zero, 0x802ECA04
/* 0x0027CDF0 0x802EC9F0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0027CDF4 0x802EC9F4 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0027CDF8 0x802EC9F8 0x00000000 */ .word 0x00000000 # nop
/* 0x0027CDFC 0x802EC9FC 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x0027CE00 0x802ECA00 0xAC20C890 */ .word 0xAC20C890 # sw $zero, -0x3770($at)
/* 0x0027CE04 0x802ECA04 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0027CE08 0x802ECA08 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0027CE0C 0x802ECA0C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
