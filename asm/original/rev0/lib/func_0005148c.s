/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005148C..0x000514B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18 at 0x5148C; jal 0x801794C8; jr $ra at 0x514A4 with delay addiu $sp,0x18 at 0x514A8; trailing alignment nop at 0x514AC attaches here. Next word at 0x514B0 begins a fresh frameless leaf (lui+jr). */
/* function boundary candidate: func_0005148C, size=96, kind=prologue */
func_0005148C:
/* 0x0005148C 0x800C108C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00051490 0x800C1090 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00051494 0x800C1094 0x0C05E532 */ .word 0x0C05E532 # jal 0x801794C8
/* 0x00051498 0x800C1098 0x00000000 */ .word 0x00000000 # nop
/* 0x0005149C 0x800C109C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000514A0 0x800C10A0 0x3042FFFF */ .word 0x3042FFFF # andi $v0, $v0, 0xFFFF
/* 0x000514A4 0x800C10A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000514A8 0x800C10A8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x000514AC 0x800C10AC 0x00000000 */ .word 0x00000000 # nop
