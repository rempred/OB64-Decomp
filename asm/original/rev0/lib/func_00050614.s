/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00050614..0x00050620 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf un-merged from parent 0x4FE04; lui $at entry; jr $ra at 0x50618 + delay 0x5061C */
func_00050614:
/* 0x00050614 0x800C0214 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00050618 0x800C0218 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005061C 0x800C021C 0xA0200F6E */ .word 0xA0200F6E # sb $zero, 0xF6E($at)
