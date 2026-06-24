/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A4410..0x002A4434 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame -0x18 leaf wrapper: two jal calls (0x8022B6F4, 0x80233398), jr $ra at 0x002A442C + delay addiu $sp,0x18 at 0x002A4430. Slice-start function (disasm opens mid-prologue). */
/* function boundary candidate: func_002A4410, size=36, kind=prologue */
func_002A4410:
/* 0x002A4410 0x80314010 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002A4414 0x80314014 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002A4418 0x80314018 0x0C08ADBD */ .word 0x0C08ADBD # jal 0x8022B6F4
/* 0x002A441C 0x8031401C 0x00000000 */ .word 0x00000000 # nop
/* 0x002A4420 0x80314020 0x0C08CCE6 */ .word 0x0C08CCE6 # jal 0x80233398
/* 0x002A4424 0x80314024 0x00000000 */ .word 0x00000000 # nop
/* 0x002A4428 0x80314028 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002A442C 0x8031402C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A4430 0x80314030 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
