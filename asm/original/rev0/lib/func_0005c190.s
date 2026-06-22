/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005C190..0x0005C1A8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: reads global 0x51A1, ori bit 0, stores back. Ends jr $ra at 0x5C1A0 with delay-slot sb at 0x5C1A4. Runs up to next framed prologue. */
func_0005c190:
/* 0x0005C190 0x800CBD90 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0005C194 0x800CBD94 0x904251A1 */ .word 0x904251A1 # lbu $v0, 0x51A1($v0)
/* 0x0005C198 0x800CBD98 0x34420001 */ .word 0x34420001 # ori $v0, $v0, 0x0001
/* 0x0005C19C 0x800CBD9C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0005C1A0 0x800CBDA0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005C1A4 0x800CBDA4 0xA02251A1 */ .word 0xA02251A1 # sb $v0, 0x51A1($at)
