/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00043BD4..0x00043C20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (j-form, lbu in delay), jr $ra at 0x43C18 */
func_00043bd4:
/* 0x00043BD4 0x800B37D4 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00043BD8 0x800B37D8 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x00043BDC 0x800B37DC 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00043BE0 0x800B37E0 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00043BE4 0x800B37E4 0x3C038018 */ .word 0x3C038018 # lui $v1, 0x8018
/* 0x00043BE8 0x800B37E8 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00043BEC 0x800B37EC 0x90637C59 */ .word 0x90637C59 # lbu $v1, 0x7C59($v1)
/* 0x00043BF0 0x800B37F0 0x30A500FF */ .word 0x30A500FF # andi $a1, $a1, 0x00FF
/* 0x00043BF4 0x800B37F4 0x10650003 */ .word 0x10650003 # beq $v1, $a1, 0x800B3804
/* 0x00043BF8 0x800B37F8 0x000510C0 */ .word 0x000510C0 # sll $v0, $a1, 3
/* 0x00043BFC 0x800B37FC 0x0805B743 */ .word 0x0805B743 # j 0x8016DD0C
/* 0x00043C00 0x800B3800 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00043C04 0x800B3804 0x000310C0 */ .word 0x000310C0 # sll $v0, $v1, 3
/* 0x00043C08 0x800B3808 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00043C0C 0x800B380C 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00043C10 0x800B3810 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x00043C14 0x800B3814 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00043C18 0x800B3818 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00043C1C 0x800B381C 0x90227C4D */ .word 0x90227C4D # lbu $v0, 0x7C4D($at)
