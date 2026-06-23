/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00173BF8..0x00173C1C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Leaf: prologue addiu $sp,-0x18, single jal 0x80179018, clears byte 0x8018F480. jr $ra@0x00173C14 + delay 0x00173C18. */
/* function boundary candidate: func_00173BF8, size=96, kind=prologue */
func_00173BF8:
/* 0x00173BF8 0x801E37F8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00173BFC 0x801E37FC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00173C00 0x801E3800 0x0C05E406 */ .word 0x0C05E406 # jal 0x80179018
/* 0x00173C04 0x801E3804 0x00000000 */ .word 0x00000000 # nop
/* 0x00173C08 0x801E3808 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00173C0C 0x801E380C 0xA020F480 */ .word 0xA020F480 # sb $zero, -0xB80($at)
/* 0x00173C10 0x801E3810 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00173C14 0x801E3814 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00173C18 0x801E3818 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
