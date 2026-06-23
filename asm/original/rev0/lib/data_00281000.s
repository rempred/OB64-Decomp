/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00281000..0x00281030 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Screen-dimension packed records: 0x028001E0 (=640/480 as two 16-bit halves) appears twice paired with 0x01FF0000, then 0x012F0130 (=303/304), then 0x18 bytes (6 words) of zero alignment. 4-byte stride packed 16-bit pairs.. */
/* 0x00281000 0x802F0C00 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x00281004 0x802F0C04 0x01FF0000 */ .word 0x01FF0000 # sll $zero, $ra, 0
/* 0x00281008 0x802F0C08 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x0028100C 0x802F0C0C 0x01FF0000 */ .word 0x01FF0000 # sll $zero, $ra, 0
/* 0x00281010 0x802F0C10 0x012F0130 */ .word 0x012F0130 # tge $t1, $t7
/* 0x00281014 0x802F0C14 0x00000000 */ .word 0x00000000 # nop
/* 0x00281018 0x802F0C18 0x00000000 */ .word 0x00000000 # nop
/* 0x0028101C 0x802F0C1C 0x00000000 */ .word 0x00000000 # nop
/* 0x00281020 0x802F0C20 0x00000000 */ .word 0x00000000 # nop
/* 0x00281024 0x802F0C24 0x00000000 */ .word 0x00000000 # nop
/* 0x00281028 0x802F0C28 0x00000000 */ .word 0x00000000 # nop
/* 0x0028102C 0x802F0C2C 0x00000000 */ .word 0x00000000 # nop
