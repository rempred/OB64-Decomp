/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000E6620..0x000E6650 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/addu chain, lbu 0x800F table, sb 0x801A:-0x11B8); jr $ra@0xE6648 + delay@0xE664C */
/* 0x000E6620 0x80156220 0x00041080 */ .word 0x00041080 # sll $v0, $a0, 2
/* 0x000E6624 0x80156224 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000E6628 0x80156228 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000E662C 0x8015622C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000E6630 0x80156230 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x000E6634 0x80156234 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x000E6638 0x80156238 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000E663C 0x8015623C 0x90228359 */ .word 0x90228359 # lbu $v0, -0x7CA7($at)
/* 0x000E6640 0x80156240 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
/* 0x000E6644 0x80156244 0x3C01801A */ .word 0x3C01801A # lui $at, 0x801A
/* 0x000E6648 0x80156248 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000E664C 0x8015624C 0xA022EE48 */ .word 0xA022EE48 # sb $v0, -0x11B8($at)
