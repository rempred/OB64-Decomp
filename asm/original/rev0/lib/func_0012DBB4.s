/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x0012DBB4..0x0012DC0C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf: divide-by-100 (magic 0x66666667) to emit two ASCII decimal digits via sb; ends jr $ra at 0x0012DC04 + delay 0x0012DC08. Parent DB merged this into func_0012DB2C. */
/* 0x0012DBB4 0x8019D7B4 0x3C026666 */ .word 0x3C026666 # lui $v0, 0x6666
/* 0x0012DBB8 0x8019D7B8 0x34426667 */ .word 0x34426667 # ori $v0, $v0, 0x6667
/* 0x0012DBBC 0x8019D7BC 0x00820018 */ .word 0x00820018 # mult $a0, $v0
/* 0x0012DBC0 0x8019D7C0 0x000417C3 */ .word 0x000417C3 # sra $v0, $a0, 31
/* 0x0012DBC4 0x8019D7C4 0x00003810 */ .word 0x00003810 # mfhi $a3
/* 0x0012DBC8 0x8019D7C8 0x00071883 */ .word 0x00071883 # sra $v1, $a3, 2
/* 0x0012DBCC 0x8019D7CC 0x00621823 */ .word 0x00621823 # subu $v1, $v1, $v0
/* 0x0012DBD0 0x8019D7D0 0x00603021 */ .word 0x00603021 # move $a2, $v1
/* 0x0012DBD4 0x8019D7D4 0x00061080 */ .word 0x00061080 # sll $v0, $a2, 2
/* 0x0012DBD8 0x8019D7D8 0x00461021 */ .word 0x00461021 # addu $v0, $v0, $a2
/* 0x0012DBDC 0x8019D7DC 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x0012DBE0 0x8019D7E0 0x10C00003 */ .word 0x10C00003 # beq $a2, $zero, 0x8019D7F0
/* 0x0012DBE4 0x8019D7E4 0x00821823 */ .word 0x00821823 # subu $v1, $a0, $v0
/* 0x0012DBE8 0x8019D7E8 0x0807652D */ .word 0x0807652D # j 0x801D94B4
/* 0x0012DBEC 0x8019D7EC 0x24C20030 */ .word 0x24C20030 # addiu $v0, $a2, 0x30
/* 0x0012DBF0 0x8019D7F0 0x24020020 */ .word 0x24020020 # addiu $v0, $zero, 0x20
/* 0x0012DBF4 0x8019D7F4 0xA0A20000 */ .word 0xA0A20000 # sb $v0, 0x0($a1)
/* 0x0012DBF8 0x8019D7F8 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0012DBFC 0x8019D7FC 0x24620030 */ .word 0x24620030 # addiu $v0, $v1, 0x30
/* 0x0012DC00 0x8019D800 0xA0A20000 */ .word 0xA0A20000 # sb $v0, 0x0($a1)
/* 0x0012DC04 0x8019D804 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0012DC08 0x8019D808 0xA0A00001 */ .word 0xA0A00001 # sb $zero, 0x1($a1)
