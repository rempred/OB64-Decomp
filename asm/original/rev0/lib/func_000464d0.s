/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000464D0..0x000464EC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x464D0), single fn, jr $ra at 0x464E4 + delay 0x464E8 */
/* function boundary candidate: func_000464D0, size=28, kind=prologue */
func_000464D0:
/* 0x000464D0 0x800B60D0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000464D4 0x800B60D4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000464D8 0x800B60D8 0x0C061864 */ .word 0x0C061864 # jal 0x80186190
/* 0x000464DC 0x800B60DC 0x00C02821 */ .word 0x00C02821 # move $a1, $a2
/* 0x000464E0 0x800B60E0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000464E4 0x800B60E4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000464E8 0x800B60E8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
