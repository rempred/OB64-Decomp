/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00146094..0x001460B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: reads obj+0x70 and obj+0x0 flag 0x40, returns boolean predicate; bne at 0x0014609C is internal (target 0x001460B0). jr $ra at 0x001460B0 + delay move $v0,$a1 at 0x001460B4. Parent split at 0x001460AC was mid-function and is corrected. */
/* 0x00146094 0x801B5C94 0x8C830070 */ .word 0x8C830070 # lw $v1, 0x70($a0)
/* 0x00146098 0x801B5C98 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0014609C 0x801B5C9C 0x14620004 */ .word 0x14620004 # bne $v1, $v0, 0x801B5CB0
/* 0x001460A0 0x801B5CA0 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x001460A4 0x801B5CA4 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x001460A8 0x801B5CA8 0x30420040 */ .word 0x30420040 # andi $v0, $v0, 0x0040

/* function boundary candidate: func_001460AC, size=12, kind=leaf */
func_001460AC:
/* 0x001460AC 0x801B5CAC 0x2C450001 */ .word 0x2C450001 # sltiu $a1, $v0, 0x1
/* 0x001460B0 0x801B5CB0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001460B4 0x801B5CB4 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
