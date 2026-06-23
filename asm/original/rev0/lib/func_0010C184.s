/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x0010C184..0x0010C1A8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Clean prologue. jr $ra at 0x0010C1A0 + delay 0x0010C1A4. */
/* function boundary candidate: func_0010C184, size=36, kind=prologue */
func_0010C184:
/* 0x0010C184 0x8017BD84 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0010C188 0x8017BD88 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x0010C18C 0x8017BD8C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0010C190 0x8017BD90 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x0010C194 0x8017BD94 0x0C06E2DC */ .word 0x0C06E2DC # jal 0x801B8B70
/* 0x0010C198 0x8017BD98 0xAC220E00 */ .word 0xAC220E00 # sw $v0, 0xE00($at)
/* 0x0010C19C 0x8017BD9C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0010C1A0 0x8017BDA0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0010C1A4 0x8017BDA4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
