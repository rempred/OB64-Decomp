/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001FF7EC..0x001FF830 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged from over-merged parent idx 61. Framed leaf (addiu $sp,-0x20). Reads 0x801D07E4/07E8/07EC, sign-extends $a0/$a1, calls 0x801BC15C, returns its result. Ends jr$ra @0x001FF828 + delay (addiu $sp,0x20) @0x001FF82C. */
/* function boundary candidate: func_001FF7EC, size=244, kind=prologue */
func_001FF7EC:
/* 0x001FF7EC 0x8026F3EC 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x001FF7F0 0x8026F3F0 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x001FF7F4 0x8026F3F4 0x8C4207E4 */ .word 0x8C4207E4 # lw $v0, 0x7E4($v0)
/* 0x001FF7F8 0x8026F3F8 0x00042400 */ .word 0x00042400 # sll $a0, $a0, 16
/* 0x001FF7FC 0x8026F3FC 0x00052C00 */ .word 0x00052C00 # sll $a1, $a1, 16
/* 0x001FF800 0x8026F400 0x3C06801D */ .word 0x3C06801D # lui $a2, 0x801D
/* 0x001FF804 0x8026F404 0x8CC607E8 */ .word 0x8CC607E8 # lw $a2, 0x7E8($a2)
/* 0x001FF808 0x8026F408 0x3C07801D */ .word 0x3C07801D # lui $a3, 0x801D
/* 0x001FF80C 0x8026F40C 0x8CE707EC */ .word 0x8CE707EC # lw $a3, 0x7EC($a3)
/* 0x001FF810 0x8026F410 0x00042403 */ .word 0x00042403 # sra $a0, $a0, 16
/* 0x001FF814 0x8026F414 0x00052C03 */ .word 0x00052C03 # sra $a1, $a1, 16
/* 0x001FF818 0x8026F418 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x001FF81C 0x8026F41C 0x0C06F057 */ .word 0x0C06F057 # jal 0x801BC15C
/* 0x001FF820 0x8026F420 0xAFA20010 */ .word 0xAFA20010 # sw $v0, 0x10($sp)
/* 0x001FF824 0x8026F424 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x001FF828 0x8026F428 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001FF82C 0x8026F42C 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
