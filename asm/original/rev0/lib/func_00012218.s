/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00012218..0x0001223C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00012218 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00012218:
/* 0x00012218 0x80081E18 0x10800006 */ .word 0x10800006 # beq $a0, $zero, 0x80081E34
/* 0x0001221C 0x80081E1C 0x00000000 */ .word 0x00000000 # nop
/* 0x00012220 0x80081E20 0x8C820010 */ .word 0x8C820010 # lw $v0, 0x10($a0)
/* 0x00012224 0x80081E24 0x04410003 */ .word 0x04410003 # bgez $v0, 0x80081E34
/* 0x00012228 0x80081E28 0x00000000 */ .word 0x00000000 # nop
/* 0x0001222C 0x80081E2C 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00012230 0x80081E30 0xAC24182C */ .word 0xAC24182C # sw $a0, 0x182C($at)
/* 0x00012234 0x80081E34 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00012238 0x80081E38 0x00000000 */ .word 0x00000000 # nop
