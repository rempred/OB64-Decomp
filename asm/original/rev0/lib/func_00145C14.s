/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145C14..0x00145C4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* No prologue; operates on args $a0/$a1/$a2 directly (srl $v0,$a2,31 ...). Byte-copy loop. Ends jr $ra at 0x145C44 + delay 0x145C48. Split out of over-merged func_00145B40. */
/* 0x00145C14 0x801B5814 0x000617C2 */ .word 0x000617C2 # srl $v0, $a2, 31
/* 0x00145C18 0x801B5818 0x00C21021 */ .word 0x00C21021 # addu $v0, $a2, $v0
/* 0x00145C1C 0x801B581C 0x00021043 */ .word 0x00021043 # sra $v0, $v0, 1
/* 0x00145C20 0x801B5820 0x00C23023 */ .word 0x00C23023 # subu $a2, $a2, $v0
/* 0x00145C24 0x801B5824 0x18C00007 */ .word 0x18C00007 # blez $a2, 0x801B5844
/* 0x00145C28 0x801B5828 0x00000000 */ .word 0x00000000 # nop
/* 0x00145C2C 0x801B582C 0x90820000 */ .word 0x90820000 # lbu $v0, 0x0($a0)
/* 0x00145C30 0x801B5830 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x00145C34 0x801B5834 0x24C6FFFF */ .word 0x24C6FFFF # addiu $a2, $a2, -0x1
/* 0x00145C38 0x801B5838 0xA0A20000 */ .word 0xA0A20000 # sb $v0, 0x0($a1)
/* 0x00145C3C 0x801B583C 0x1CC0FFFB */ .word 0x1CC0FFFB # bgtz $a2, 0x801B582C
/* 0x00145C40 0x801B5840 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00145C44 0x801B5844 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145C48 0x801B5848 0x00000000 */ .word 0x00000000 # nop
