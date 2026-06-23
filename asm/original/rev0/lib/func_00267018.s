/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00267018..0x00267038 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Thin wrapper leaf: jal 0x80212220, addiu $a0,$a0,0x18; returns 0. Ends jr$ra at 0x00267030 + delay 0x00267034. Conservative DB record over-ran into the next function's preamble at 0x00267038; split here. */
/* function boundary candidate: func_00267018, size=32, kind=prologue */
func_00267018:
/* 0x00267018 0x802D6C18 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026701C 0x802D6C1C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00267020 0x802D6C20 0x0C084888 */ .word 0x0C084888 # jal 0x80212220
/* 0x00267024 0x802D6C24 0x24840018 */ .word 0x24840018 # addiu $a0, $a0, 0x18
/* 0x00267028 0x802D6C28 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026702C 0x802D6C2C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00267030 0x802D6C30 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00267034 0x802D6C34 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
