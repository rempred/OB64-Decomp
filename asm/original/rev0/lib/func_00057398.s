/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x00057398..0x000573AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Hidden frameless leaf (over-merged tail of parent file 35). After prior jr+delay; frameless body reads $a0/$a1 args (lw $v0,0xD0($a0); sll $a1,$a1,2; addu; lw), jr $ra at 0x000573A4 with delay slot lw $v0,0x530($a1) at 0x000573A8. Ends at next prologue 0x000573AC. */
func_00057398:
/* 0x00057398 0x800C6F98 0x8C8200D0 */ .word 0x8C8200D0 # lw $v0, 0xD0($a0)
/* 0x0005739C 0x800C6F9C 0x00052880 */ .word 0x00052880 # sll $a1, $a1, 2
/* 0x000573A0 0x800C6FA0 0x00A22821 */ .word 0x00A22821 # addu $a1, $a1, $v0
/* 0x000573A4 0x800C6FA4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000573A8 0x800C6FA8 0x8CA20530 */ .word 0x8CA20530 # lw $v0, 0x530($a1)
