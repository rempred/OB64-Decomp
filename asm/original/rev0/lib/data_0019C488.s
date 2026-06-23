/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x0019C488..0x0019C4BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Byte-pattern index table, 13 words. First/third bytes step by 0x04 with second/fourth byte fixed at 0x02: 00 02 02 02 / 04 02 06 02 / 08 02 0A 02 / 0C 02 0E 02 / 10 02 12 02 / 14 02 16 02 / 18 02 1A 02 / 1C 02 1E 02 / 20 02 22 02 / 24 02 26 02 / 28 02 2A 02 / 2C 02 2E 02 / 30 02 00 00. Looks like a packed (index,stride=2) lookup/jump-index table, not ASCII or pointers.. */
/* 0x0019C488 0x8020C088 0x00020202 */ .word 0x00020202 # srl $zero, $v0, 8
/* 0x0019C48C 0x8020C08C 0x04020602 */ .word 0x04020602 # bltzl $zero, 0x8020D898
/* 0x0019C490 0x8020C090 0x08020A02 */ .word 0x08020A02 # j 0x80082808
/* 0x0019C494 0x8020C094 0x0C020E02 */ .word 0x0C020E02 # jal 0x80083808
/* 0x0019C498 0x8020C098 0x10021202 */ .word 0x10021202 # beq $zero, $v0, 0x802108A4
/* 0x0019C49C 0x8020C09C 0x14021602 */ .word 0x14021602 # bne $zero, $v0, 0x802118A8
/* 0x0019C4A0 0x8020C0A0 0x18021A02 */ .word 0x18021A02 # blez $zero, 0x802128AC
/* 0x0019C4A4 0x8020C0A4 0x1C021E02 */ .word 0x1C021E02 # bgtz $zero, 0x802138B0
/* 0x0019C4A8 0x8020C0A8 0x20022202 */ .word 0x20022202 # addi $v0, $zero, 0x2202
/* 0x0019C4AC 0x8020C0AC 0x24022602 */ .word 0x24022602 # addiu $v0, $zero, 0x2602
/* 0x0019C4B0 0x8020C0B0 0x28022A02 */ .word 0x28022A02 # slti $v0, $zero, 0x2A02
/* 0x0019C4B4 0x8020C0B4 0x2C022E02 */ .word 0x2C022E02 # sltiu $v0, $zero, 0x2E02
/* 0x0019C4B8 0x8020C0B8 0x30020000 */ .word 0x30020000 # andi $v0, $zero, 0x0000
