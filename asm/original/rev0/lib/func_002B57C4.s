/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B57C4..0x002B57E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor. Loads 0x802319F4[index], returns lbu 0x85($v0). jr $ra@0x002B57D8 + delay (lbu in delay slot)@0x002B57DC. */
func_002B57C4:
/* 0x002B57C4 0x803253C4 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002B57C8 0x803253C8 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002B57CC 0x803253CC 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x002B57D0 0x803253D0 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x002B57D4 0x803253D4 0x8C8219F4 */ .word 0x8C8219F4 # lw $v0, 0x19F4($a0)
/* 0x002B57D8 0x803253D8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B57DC 0x803253DC 0x90420085 */ .word 0x90420085 # lbu $v0, 0x85($v0)
