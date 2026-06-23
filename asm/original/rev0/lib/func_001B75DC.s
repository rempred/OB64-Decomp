/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001B75DC..0x001B762C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no addiu $sp; uses leaf convention) beginning on the word after the prior function's delay slot. Inits $a1=1, builds pointer $a0=0x8019:3BF8, loops index<0x5F over a 0x38-stride record copying field 0x16->0x18 under range checks. Writes $a1 and $a0 before reading them => NOT a read-before-write preamble, so it is its own leaf, not folded. Epilogue jr$ra(0x001B7624)+delay nop(0x001B7628). Trailing pad nop at 0x001B7628 is the jr delay slot and stays with this function. */
func_001B75DC:
/* 0x001B75DC 0x802271DC 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x001B75E0 0x802271E0 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x001B75E4 0x802271E4 0x24843BF8 */ .word 0x24843BF8 # addiu $a0, $a0, 0x3BF8
/* 0x001B75E8 0x802271E8 0x90820011 */ .word 0x90820011 # lbu $v0, 0x11($a0)
/* 0x001B75EC 0x802271EC 0x5040000A */ .word 0x5040000A # beql $v0, $zero, 0x80227218
/* 0x001B75F0 0x802271F0 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x001B75F4 0x802271F4 0x90830012 */ .word 0x90830012 # lbu $v1, 0x12($a0)
/* 0x001B75F8 0x802271F8 0x28620031 */ .word 0x28620031 # slti $v0, $v1, 0x31
/* 0x001B75FC 0x802271FC 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x80227214
/* 0x001B7600 0x80227200 0x2862002D */ .word 0x2862002D # slti $v0, $v1, 0x2D
/* 0x001B7604 0x80227204 0x54400004 */ .word 0x54400004 # bnel $v0, $zero, 0x80227218
/* 0x001B7608 0x80227208 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x001B760C 0x8022720C 0x94820016 */ .word 0x94820016 # lhu $v0, 0x16($a0)
/* 0x001B7610 0x80227210 0xA4820018 */ .word 0xA4820018 # sh $v0, 0x18($a0)
/* 0x001B7614 0x80227214 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x001B7618 0x80227218 0x28A2005F */ .word 0x28A2005F # slti $v0, $a1, 0x5F
/* 0x001B761C 0x8022721C 0x1440FFF2 */ .word 0x1440FFF2 # bne $v0, $zero, 0x802271E8
/* 0x001B7620 0x80227220 0x24840038 */ .word 0x24840038 # addiu $a0, $a0, 0x38
/* 0x001B7624 0x80227224 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001B7628 0x80227228 0x00000000 */ .word 0x00000000 # nop
