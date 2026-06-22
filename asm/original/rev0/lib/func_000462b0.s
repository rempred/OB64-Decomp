/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000462B0..0x000462D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll index math), jr $ra at 0x462C8 + delay 0x462CC */
func_000462b0:
/* 0x000462B0 0x800B5EB0 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x000462B4 0x800B5EB4 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000462B8 0x800B5EB8 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000462BC 0x800B5EBC 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000462C0 0x800B5EC0 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000462C4 0x800B5EC4 0x942251CC */ .word 0x942251CC # lhu $v0, 0x51CC($at)
/* 0x000462C8 0x800B5EC8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000462CC 0x800B5ECC 0x30420004 */ .word 0x30420004 # andi $v0, $v0, 0x0004
