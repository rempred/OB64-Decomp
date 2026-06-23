/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F1000..0x001F102C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler tail: continuation of a function whose entry is in the previous 64 KiB chunk. Incoming straddler-tail: continues func_001F0F9C (prologue in chunk 30 @0x1F0F9C). Returns jr$ra@0x1F1024 + delay nop@0x1F1028. */
func_001F0F9C_chunk31tail:
rev0_code_001F1000:
/* 0x001F1000 0x80260C00 0x00461021 */ .word 0x00461021 # addu $v0, $v0, $a2
/* 0x001F1004 0x80260C04 0x0806B6E4 */ .word 0x0806B6E4 # j 0x801ADB90
/* 0x001F1008 0x80260C08 0xAC4052C0 */ .word 0xAC4052C0 # sw $zero, 0x52C0($v0)
/* 0x001F100C 0x80260C0C 0x8CC256C0 */ .word 0x8CC256C0 # lw $v0, 0x56C0($a2)
/* 0x001F1010 0x80260C10 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x001F1014 0x80260C14 0x00A2102B */ .word 0x00A2102B # sltu $v0, $a1, $v0
/* 0x001F1018 0x80260C18 0x1440FFE5 */ .word 0x1440FFE5 # bne $v0, $zero, 0x80260BB0
/* 0x001F101C 0x80260C1C 0x00051080 */ .word 0x00051080 # sll $v0, $a1, 2
/* 0x001F1020 0x80260C20 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x001F1024 0x80260C24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F1028 0x80260C28 0x00000000 */ .word 0x00000000 # nop
