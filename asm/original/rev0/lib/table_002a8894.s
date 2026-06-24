/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A8894..0x002A88B4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Paired RAM-pointer + index table: 4 records of {ptr 0x802393BC/0x802393AC/0x802393A0/0x80239390, index 0x01/0x02/0x03/0x04}. 8 words; ptr targets are 0x80239xxx data/string addrs.. */
/* 0x002A8894 0x80318494 0x802393BC */ .word 0x802393BC # lb $v1, -0x6C44($at)
/* 0x002A8898 0x80318498 0x01000000 */ .word 0x01000000 # sll $zero, $zero, 0
/* 0x002A889C 0x8031849C 0x802393AC */ .word 0x802393AC # lb $v1, -0x6C54($at)
/* 0x002A88A0 0x803184A0 0x02000000 */ .word 0x02000000 # sll $zero, $zero, 0
/* 0x002A88A4 0x803184A4 0x802393A0 */ .word 0x802393A0 # lb $v1, -0x6C60($at)
/* 0x002A88A8 0x803184A8 0x03000000 */ .word 0x03000000 # sll $zero, $zero, 0
/* 0x002A88AC 0x803184AC 0x80239390 */ .word 0x80239390 # lb $v1, -0x6C70($at)
/* 0x002A88B0 0x803184B0 0x04000000 */ .word 0x04000000 # bltz $zero, 0x803184B4
