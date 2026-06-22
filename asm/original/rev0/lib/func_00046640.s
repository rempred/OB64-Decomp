/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046640..0x00046654 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui, sb store), jr $ra at 0x4664C + delay 0x46650 */
func_00046640:
/* 0x00046640 0x800B6240 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x00046644 0x800B6244 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00046648 0x800B6248 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x0004664C 0x800B624C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046650 0x800B6250 0xA0266B02 */ .word 0xA0266B02 # sb $a2, 0x6B02($at)
