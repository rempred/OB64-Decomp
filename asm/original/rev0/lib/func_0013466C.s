/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x0013466C..0x00134690 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf falling through after func_001344D4's jr/delay. No addiu $sp; reads $a0 (lhu 0x4/lbu 0x3/lhu 0x6) read-before-write. Ends jr $ra at 0x00134688 + delay 0x0013468C. */
/* 0x0013466C 0x801A426C 0x94820004 */ .word 0x94820004 # lhu $v0, 0x4($a0)
/* 0x00134670 0x801A4270 0x90830003 */ .word 0x90830003 # lbu $v1, 0x3($a0)
/* 0x00134674 0x801A4274 0x94840006 */ .word 0x94840006 # lhu $a0, 0x6($a0)
/* 0x00134678 0x801A4278 0x00621004 */ .word 0x00621004 # sllv $v0, $v0, $v1
/* 0x0013467C 0x801A427C 0x00021042 */ .word 0x00021042 # srl $v0, $v0, 1
/* 0x00134680 0x801A4280 0x00440018 */ .word 0x00440018 # mult $v0, $a0
/* 0x00134684 0x801A4284 0x00001012 */ .word 0x00001012 # mflo $v0
/* 0x00134688 0x801A4288 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0013468C 0x801A428C 0x00000000 */ .word 0x00000000 # nop
