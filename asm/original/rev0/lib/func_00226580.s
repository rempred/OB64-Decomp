/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00226580..0x002265CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf; reads 0x801D0714, computes index via shift chain, stores to 0x801D0714. Ends jr $ra @002265C4 + delay (sh $v0,0x714). */
/* 0x00226580 0x80296180 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x00226584 0x80296184 0x94420714 */ .word 0x94420714 # lhu $v0, 0x714($v0)
/* 0x00226588 0x80296188 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x0022658C 0x8029618C 0x8C63081C */ .word 0x8C63081C # lw $v1, 0x81C($v1)
/* 0x00226590 0x80296190 0xAC800008 */ .word 0xAC800008 # sw $zero, 0x8($a0)
/* 0x00226594 0x80296194 0xA4820000 */ .word 0xA4820000 # sh $v0, 0x0($a0)
/* 0x00226598 0x80296198 0x00832023 */ .word 0x00832023 # subu $a0, $a0, $v1
/* 0x0022659C 0x8029619C 0x00041940 */ .word 0x00041940 # sll $v1, $a0, 5
/* 0x002265A0 0x802961A0 0x00641823 */ .word 0x00641823 # subu $v1, $v1, $a0
/* 0x002265A4 0x802961A4 0x00031940 */ .word 0x00031940 # sll $v1, $v1, 5
/* 0x002265A8 0x802961A8 0x00641821 */ .word 0x00641821 # addu $v1, $v1, $a0
/* 0x002265AC 0x802961AC 0x000313C0 */ .word 0x000313C0 # sll $v0, $v1, 15
/* 0x002265B0 0x802961B0 0x00431023 */ .word 0x00431023 # subu $v0, $v0, $v1
/* 0x002265B4 0x802961B4 0x00021140 */ .word 0x00021140 # sll $v0, $v0, 5
/* 0x002265B8 0x802961B8 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x002265BC 0x802961BC 0x00021083 */ .word 0x00021083 # sra $v0, $v0, 2
/* 0x002265C0 0x802961C0 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x002265C4 0x802961C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002265C8 0x802961C8 0xA4220714 */ .word 0xA4220714 # sh $v0, 0x714($at)
