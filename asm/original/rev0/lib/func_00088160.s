/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x00088160..0x00088174 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Hidden frameless leaf (5 words) missed by parent (folded into idx1). Reads $a0/$a1: lw 0xF4($a0); sll; addu; jr $ra at 0x8816C + delay 0x88170 (lw 0x500($a1)). Next entry 0x88174 is a framed prologue. */
func_00088160:
/* 0x00088160 0x800F7D60 0x8C8200F4 */ .word 0x8C8200F4 # lw $v0, 0xF4($a0)
/* 0x00088164 0x800F7D64 0x00052880 */ .word 0x00052880 # sll $a1, $a1, 2
/* 0x00088168 0x800F7D68 0x00A22821 */ .word 0x00A22821 # addu $a1, $a1, $v0
/* 0x0008816C 0x800F7D6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00088170 0x800F7D70 0x8CA20500 */ .word 0x8CA20500 # lw $v0, 0x500($a1)
