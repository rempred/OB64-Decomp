/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00050604..0x00050614 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf un-merged from parent 0x4FE04; addiu $v0,1 entry; jr $ra at 0x5060C + delay 0x50610 */
func_00050604:
/* 0x00050604 0x800C0204 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00050608 0x800C0208 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0005060C 0x800C020C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00050610 0x800C0210 0xA0220F6E */ .word 0xA0220F6E # sb $v0, 0xF6E($at)
