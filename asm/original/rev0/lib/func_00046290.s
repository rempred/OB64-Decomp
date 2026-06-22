/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046290..0x000462B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll index math), jr $ra at 0x462A8 + delay 0x462AC */
func_00046290:
/* 0x00046290 0x800B5E90 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x00046294 0x800B5E94 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046298 0x800B5E98 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x0004629C 0x800B5E9C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000462A0 0x800B5EA0 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000462A4 0x800B5EA4 0x942251CC */ .word 0x942251CC # lhu $v0, 0x51CC($at)
/* 0x000462A8 0x800B5EA8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000462AC 0x800B5EAC 0x30420002 */ .word 0x30420002 # andi $v0, $v0, 0x0002
