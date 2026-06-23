/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00173C1C..0x00173C58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered: parent DB over-merged this into func_00173BF8. Frameless (no addiu $sp), self-contained: reads 0x80214E84 flag, conditionally clears 0x801F0DE0/0x801F0DE8 and masks 0x801F365D. jr $ra@0x00173C50 + delay 0x00173C54 (nop). */
/* 0x00173C1C 0x801E381C 0x3C028021 */ .word 0x3C028021 # lui $v0, 0x8021
/* 0x00173C20 0x801E3820 0x90424E84 */ .word 0x90424E84 # lbu $v0, 0x4E84($v0)
/* 0x00173C24 0x801E3824 0x1440000A */ .word 0x1440000A # bne $v0, $zero, 0x801E3850
/* 0x00173C28 0x801E3828 0x00000000 */ .word 0x00000000 # nop
/* 0x00173C2C 0x801E382C 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x00173C30 0x801E3830 0x9042365D */ .word 0x9042365D # lbu $v0, 0x365D($v0)
/* 0x00173C34 0x801E3834 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00173C38 0x801E3838 0xAC200DE0 */ .word 0xAC200DE0 # sw $zero, 0xDE0($at)
/* 0x00173C3C 0x801E383C 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00173C40 0x801E3840 0xAC200DE8 */ .word 0xAC200DE8 # sw $zero, 0xDE8($at)
/* 0x00173C44 0x801E3844 0x304200FE */ .word 0x304200FE # andi $v0, $v0, 0x00FE
/* 0x00173C48 0x801E3848 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00173C4C 0x801E384C 0xA022365D */ .word 0xA022365D # sb $v0, 0x365D($at)
/* 0x00173C50 0x801E3850 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00173C54 0x801E3854 0x00000000 */ .word 0x00000000 # nop
