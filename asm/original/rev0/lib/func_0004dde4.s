/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DDE4..0x0004DE00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue leaf, jr $ra at 0x0004DDF8 + delay 0x0004DDFC */
/* function boundary candidate: func_0004DDE4, size=28, kind=prologue */
func_0004DDE4:
/* 0x0004DDE4 0x800BD9E4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DDE8 0x800BD9E8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DDEC 0x800BD9EC 0x0C0695DB */ .word 0x0C0695DB # jal 0x801A576C
/* 0x0004DDF0 0x800BD9F0 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DDF4 0x800BD9F4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DDF8 0x800BD9F8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DDFC 0x800BD9FC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
