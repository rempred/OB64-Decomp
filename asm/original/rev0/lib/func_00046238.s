/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046238..0x0004624C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui), jr $ra at 0x46244 + delay 0x46248 */
func_00046238:
/* 0x00046238 0x800B5E38 0x00042040 */ .word 0x00042040 # sll $a0, $a0, 1
/* 0x0004623C 0x800B5E3C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046240 0x800B5E40 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046244 0x800B5E44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046248 0x800B5E48 0x94420EBC */ .word 0x94420EBC # lhu $v0, 0xEBC($v0)
