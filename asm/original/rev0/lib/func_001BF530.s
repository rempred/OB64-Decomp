/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BF530..0x001BF540 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 4-word frameless predicate: lbu $v0,0xD($a0); xori 0x5; sltiu 1 -> returns ($a0->0xD == 5). jr$ra at 0x1BF538 + delay 0x1BF53C. */
func_001BF530:
/* 0x001BF530 0x8022F130 0x9082000D */ .word 0x9082000D # lbu $v0, 0xD($a0)
/* 0x001BF534 0x8022F134 0x38420005 */ .word 0x38420005 # xori $v0, $v0, 0x0005
/* 0x001BF538 0x8022F138 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BF53C 0x8022F13C 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
