/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000118C4..0x000118F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000118C4 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000118c4:
/* 0x000118C4 0x800814C4 0x30820001 */ .word 0x30820001 # andi $v0, $a0, 0x0001
/* 0x000118C8 0x800814C8 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800814D8
/* 0x000118CC 0x800814CC 0x30820002 */ .word 0x30820002 # andi $v0, $a0, 0x0002
/* 0x000118D0 0x800814D0 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000118D4 0x800814D4 0xA425181C */ .word 0xA425181C # sh $a1, 0x181C($at)
/* 0x000118D8 0x800814D8 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800814E8
/* 0x000118DC 0x800814DC 0x00000000 */ .word 0x00000000 # nop
/* 0x000118E0 0x800814E0 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000118E4 0x800814E4 0xA425181E */ .word 0xA425181E # sh $a1, 0x181E($at)
/* 0x000118E8 0x800814E8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000118EC 0x800814EC 0x00000000 */ .word 0x00000000 # nop
