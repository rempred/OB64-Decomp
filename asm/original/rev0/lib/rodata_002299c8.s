/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x002299C8..0x00229A00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII format-string pool: "%s joined the battalion.", "%s was not persuaded.\x00\x00\x00".. */
/* 0x002299C8 0x802995C8 0x2573206A */ .word 0x2573206A # addiu $s3, $t3, 0x206A
/* 0x002299CC 0x802995CC 0x6F696E65 */ .word 0x6F696E65 # ldr $t1, 0x6E65($k1)
/* 0x002299D0 0x802995D0 0x64207468 */ .word 0x64207468 # daddiu $zero, $at, 0x7468
/* 0x002299D4 0x802995D4 0x65206261 */ .word 0x65206261 # daddiu $zero, $t1, 0x6261
/* 0x002299D8 0x802995D8 0x7474616C */ .word 0x7474616C # op_0x1D
/* 0x002299DC 0x802995DC 0x696F6E2E */ .word 0x696F6E2E # ldl $t7, 0x6E2E($t3)
/* 0x002299E0 0x802995E0 0x00000000 */ .word 0x00000000 # nop
/* 0x002299E4 0x802995E4 0x25732077 */ .word 0x25732077 # addiu $s3, $t3, 0x2077
/* 0x002299E8 0x802995E8 0x6173206E */ .word 0x6173206E # daddi $s3, $t3, 0x206E
/* 0x002299EC 0x802995EC 0x6F742070 */ .word 0x6F742070 # ldr $s4, 0x2070($k1)
/* 0x002299F0 0x802995F0 0x65727375 */ .word 0x65727375 # daddiu $s2, $t3, 0x7375
/* 0x002299F4 0x802995F4 0x61646564 */ .word 0x61646564 # daddi $a0, $t3, 0x6564
/* 0x002299F8 0x802995F8 0x2E000000 */ .word 0x2E000000 # sltiu $zero, $s0, 0x0
/* 0x002299FC 0x802995FC 0x00000000 */ .word 0x00000000 # nop
