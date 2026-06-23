/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DBDD8..0x000DBE18 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Tail mixed block: 3 RAM pointers 0x8016DC2C,0x8016DCD4,0x8016DD74 @DBDD8-DBDE4 (too few for a table part); then small byte rows '02 02 02 01 01 01 00 00','00 00 00 00 01 01 01 02 ...' index/permutation data @DBDE4-DBE08; two zero words @DBE08; and a final power-of-two bitmask row '01 02 04 08 10 20 40 80' @DBE10 (matches the same 8-byte bitmask seen at 0xDBDD0). Closes the region at 0xDBE18.. */
/* 0x000DBDD8 0x8014B9D8 0x8016DC2C */ .word 0x8016DC2C # lb $s6, -0x23D4($zero)
/* 0x000DBDDC 0x8014B9DC 0x8016DCD4 */ .word 0x8016DCD4 # lb $s6, -0x232C($zero)
/* 0x000DBDE0 0x8014B9E0 0x8016DD74 */ .word 0x8016DD74 # lb $s6, -0x228C($zero)
/* 0x000DBDE4 0x8014B9E4 0x02020201 */ .word 0x02020201 # special_0x01
/* 0x000DBDE8 0x8014B9E8 0x01010000 */ .word 0x01010000 # sll $zero, $at, 0
/* 0x000DBDEC 0x8014B9EC 0x00000000 */ .word 0x00000000 # nop
/* 0x000DBDF0 0x8014B9F0 0x01010102 */ .word 0x01010102 # srl $zero, $at, 4
/* 0x000DBDF4 0x8014B9F4 0x02020201 */ .word 0x02020201 # special_0x01
/* 0x000DBDF8 0x8014B9F8 0x00020100 */ .word 0x00020100 # sll $zero, $v0, 4
/* 0x000DBDFC 0x8014B9FC 0x02010000 */ .word 0x02010000 # sll $zero, $at, 0
/* 0x000DBE00 0x8014BA00 0x01020001 */ .word 0x01020001 # special_0x01
/* 0x000DBE04 0x8014BA04 0x02000102 */ .word 0x02000102 # srl $zero, $zero, 4
/* 0x000DBE08 0x8014BA08 0x00000000 */ .word 0x00000000 # nop
/* 0x000DBE0C 0x8014BA0C 0x00000000 */ .word 0x00000000 # nop
/* 0x000DBE10 0x8014BA10 0x01020408 */ .word 0x01020408 # jr $t0
/* 0x000DBE14 0x8014BA14 0x10204080 */ .word 0x10204080 # beq $at, $zero, 0x8015BC18
