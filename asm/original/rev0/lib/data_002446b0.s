/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x002446B0..0x002446E4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): packed halfword/parameter block: 0x028001E0/0x01FF0000 paired records, 0x00000400/0x02000000 pairs, 0x00020000,0x01020000,0x00100000, zero pad. 16-bit coordinate/size-like values.. */
/* 0x002446B0 0x802B42B0 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x002446B4 0x802B42B4 0x01FF0000 */ .word 0x01FF0000 # sll $zero, $ra, 0
/* 0x002446B8 0x802B42B8 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x002446BC 0x802B42BC 0x01FF0000 */ .word 0x01FF0000 # sll $zero, $ra, 0
/* 0x002446C0 0x802B42C0 0x00000400 */ .word 0x00000400 # sll $zero, $zero, 16
/* 0x002446C4 0x802B42C4 0x02000000 */ .word 0x02000000 # sll $zero, $zero, 0
/* 0x002446C8 0x802B42C8 0x00000400 */ .word 0x00000400 # sll $zero, $zero, 16
/* 0x002446CC 0x802B42CC 0x02000000 */ .word 0x02000000 # sll $zero, $zero, 0
/* 0x002446D0 0x802B42D0 0x00020000 */ .word 0x00020000 # sll $zero, $v0, 0
/* 0x002446D4 0x802B42D4 0x01020000 */ .word 0x01020000 # sll $zero, $v0, 0
/* 0x002446D8 0x802B42D8 0x00100000 */ .word 0x00100000 # sll $zero, $s0, 0
/* 0x002446DC 0x802B42DC 0x00000000 */ .word 0x00000000 # nop
/* 0x002446E0 0x802B42E0 0x00000000 */ .word 0x00000000 # nop
