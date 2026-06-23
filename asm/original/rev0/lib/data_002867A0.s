/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002867A0..0x002867D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed small-value record block: 0x028001E0/0x01FF0004 pair x2 then 0x050003C0/0x01FF0004 pair x2 (looks like 16-bit field pairs, stride 8), followed by 4 trailing zero words. Cannot fully type.. */
/* 0x002867A0 0x802F63A0 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x002867A4 0x802F63A4 0x01FF0004 */ .word 0x01FF0004 # sllv $zero, $ra, $t7
/* 0x002867A8 0x802F63A8 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x002867AC 0x802F63AC 0x01FF0004 */ .word 0x01FF0004 # sllv $zero, $ra, $t7
/* 0x002867B0 0x802F63B0 0x050003C0 */ .word 0x050003C0 # bltz $t0, 0x802F72B4
/* 0x002867B4 0x802F63B4 0x01FF0004 */ .word 0x01FF0004 # sllv $zero, $ra, $t7
/* 0x002867B8 0x802F63B8 0x050003C0 */ .word 0x050003C0 # bltz $t0, 0x802F72BC
/* 0x002867BC 0x802F63BC 0x01FF0004 */ .word 0x01FF0004 # sllv $zero, $ra, $t7
/* 0x002867C0 0x802F63C0 0x00000000 */ .word 0x00000000 # nop
/* 0x002867C4 0x802F63C4 0x00000000 */ .word 0x00000000 # nop
/* 0x002867C8 0x802F63C8 0x00000000 */ .word 0x00000000 # nop
/* 0x002867CC 0x802F63CC 0x00000000 */ .word 0x00000000 # nop
