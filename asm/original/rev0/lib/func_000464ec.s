/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000464EC..0x0004650C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x464EC), jr $ra at 0x46504 + delay 0x46508 */
/* function boundary candidate: func_000464EC, size=92, kind=prologue */
func_000464EC:
/* 0x000464EC 0x800B60EC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000464F0 0x800B60F0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000464F4 0x800B60F4 0x0C05ADCE */ .word 0x0C05ADCE # jal 0x8016B738
/* 0x000464F8 0x800B60F8 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000464FC 0x800B60FC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00046500 0x800B6100 0x3042FFFF */ .word 0x3042FFFF # andi $v0, $v0, 0xFFFF
/* 0x00046504 0x800B6104 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046508 0x800B6108 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
