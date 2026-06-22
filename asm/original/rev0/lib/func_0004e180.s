/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E180..0x0004E19C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue, jr $ra at 0x0004E194 + delay 0x0004E198 */
/* function boundary candidate: func_0004E180, size=28, kind=prologue */
func_0004E180:
/* 0x0004E180 0x800BDD80 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004E184 0x800BDD84 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004E188 0x800BDD88 0x0C089B6A */ .word 0x0C089B6A # jal 0x80226DA8
/* 0x0004E18C 0x800BDD8C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E190 0x800BDD90 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004E194 0x800BDD94 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E198 0x800BDD98 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
