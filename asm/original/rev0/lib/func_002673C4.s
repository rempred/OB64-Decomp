/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x002673C4..0x002673F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Thin wrapper leaf: jal 0x80212558, addiu $a0,$a0,0x18; returns 0. Ends jr$ra at 0x002673DC + delay 0x002673E0; trailing 3 nops (0x002673E4-0x002673EC) are alignment attached to this function's end. */
/* function boundary candidate: func_002673C4, size=32, kind=prologue */
func_002673C4:
/* 0x002673C4 0x802D6FC4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002673C8 0x802D6FC8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002673CC 0x802D6FCC 0x0C084956 */ .word 0x0C084956 # jal 0x80212558
/* 0x002673D0 0x802D6FD0 0x24840018 */ .word 0x24840018 # addiu $a0, $a0, 0x18
/* 0x002673D4 0x802D6FD4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002673D8 0x802D6FD8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002673DC 0x802D6FDC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002673E0 0x802D6FE0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x002673E4 0x802D6FE4 0x00000000 */ .word 0x00000000 # nop
/* 0x002673E8 0x802D6FE8 0x00000000 */ .word 0x00000000 # nop
/* 0x002673EC 0x802D6FEC 0x00000000 */ .word 0x00000000 # nop
