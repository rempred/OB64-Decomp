/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x00127BFC..0x00127C50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed leaf, frameSize 0x8 (no callees). Counts entries in a 0x801951B0 record table. Ends jr $ra @0x00127C48 + delay slot @0x00127C4C = slice end 0x00127C50. */
/* function boundary candidate: func_00127BFC, size=84, kind=prologue */
func_00127BFC:
/* 0x00127BFC 0x801977FC 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00127C00 0x80197800 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x00127C04 0x80197804 0x8C421070 */ .word 0x8C421070 # lw $v0, 0x1070($v0)
/* 0x00127C08 0x80197808 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x00127C0C 0x8019780C 0x1840000D */ .word 0x1840000D # blez $v0, 0x80197844
/* 0x00127C10 0x80197810 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00127C14 0x80197814 0x00403021 */ .word 0x00403021 # move $a2, $v0
/* 0x00127C18 0x80197818 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00127C1C 0x8019781C 0x246351B0 */ .word 0x246351B0 # addiu $v1, $v1, 0x51B0
/* 0x00127C20 0x80197820 0x9462001C */ .word 0x9462001C # lhu $v0, 0x1C($v1)
/* 0x00127C24 0x80197824 0x30420002 */ .word 0x30420002 # andi $v0, $v0, 0x0002
/* 0x00127C28 0x80197828 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x80197838
/* 0x00127C2C 0x8019782C 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x00127C30 0x80197830 0x94620020 */ .word 0x94620020 # lhu $v0, 0x20($v1)
/* 0x00127C34 0x80197834 0x00A22821 */ .word 0x00A22821 # addu $a1, $a1, $v0
/* 0x00127C38 0x80197838 0x0086102A */ .word 0x0086102A # slt $v0, $a0, $a2
/* 0x00127C3C 0x8019783C 0x1440FFF8 */ .word 0x1440FFF8 # bne $v0, $zero, 0x80197820
/* 0x00127C40 0x80197840 0x24630024 */ .word 0x24630024 # addiu $v1, $v1, 0x24
/* 0x00127C44 0x80197844 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x00127C48 0x80197848 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00127C4C 0x8019784C 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
