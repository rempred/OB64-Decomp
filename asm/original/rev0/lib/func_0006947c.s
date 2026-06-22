/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00061000_00071000.s
 * z64 range: 0x0006947C..0x000694B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* addiu $sp,-0x18 prologue (idx18 head). Return jr@0x694A0 + delay-slot sp-restore @0x694A4, followed by alignment nops @0x694A8/0x694AC attached to this function. Non-code data begins at 0x694B0. */
func_0006947c:
/* 0x0006947C 0x800D907C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00069480 0x800D9080 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00069484 0x800D9084 0x0C022684 */ .word 0x0C022684 # jal 0x80089A10
/* 0x00069488 0x800D9088 0x00000000 */ .word 0x00000000 # nop
/* 0x0006948C 0x800D908C 0x0C066744 */ .word 0x0C066744 # jal 0x80199D10
/* 0x00069490 0x800D9090 0x00000000 */ .word 0x00000000 # nop
/* 0x00069494 0x800D9094 0x1040FFFB */ .word 0x1040FFFB # beq $v0, $zero, 0x800D9084
/* 0x00069498 0x800D9098 0x00000000 */ .word 0x00000000 # nop
/* 0x0006949C 0x800D909C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000694A0 0x800D90A0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000694A4 0x800D90A4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x000694A8 0x800D90A8 0x00000000 */ .word 0x00000000 # nop
/* 0x000694AC 0x800D90AC 0x00000000 */ .word 0x00000000 # nop
