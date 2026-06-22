/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DFCC..0x0004DFE8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue, jr $ra at 0x0004DFE0 + delay 0x0004DFE4 */
/* function boundary candidate: func_0004DFCC, size=28, kind=prologue */
func_0004DFCC:
/* 0x0004DFCC 0x800BDBCC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DFD0 0x800BDBD0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DFD4 0x800BDBD4 0x0C06DB02 */ .word 0x0C06DB02 # jal 0x801B6C08
/* 0x0004DFD8 0x800BDBD8 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DFDC 0x800BDBDC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DFE0 0x800BDBE0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DFE4 0x800BDBE4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
