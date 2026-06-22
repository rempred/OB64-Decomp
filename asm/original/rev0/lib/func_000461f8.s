/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000461F8..0x00046218 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn, jr $ra at 0x46210 + delay 0x46214; un-merged from parent file 0x461F8 cluster */
/* function boundary candidate: func_000461F8, size=252, kind=prologue */
func_000461F8:
/* 0x000461F8 0x800B5DF8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000461FC 0x800B5DFC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00046200 0x800B5E00 0x00042400 */ .word 0x00042400 # sll $a0, $a0, 16
/* 0x00046204 0x800B5E04 0x0C05BFBD */ .word 0x0C05BFBD # jal 0x8016FEF4
/* 0x00046208 0x800B5E08 0x00042403 */ .word 0x00042403 # sra $a0, $a0, 16
/* 0x0004620C 0x800B5E0C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00046210 0x800B5E10 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046214 0x800B5E14 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
