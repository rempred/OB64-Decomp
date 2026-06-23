/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x002669F0..0x00266A10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless-framed leaf: addiu $sp,-0x18; sw $ra; jal 0x80211C10; ...; move $v0,$zero; jr $ra. Slice-start leaf with no glabel in body. */
/* function boundary candidate: func_002669F0, size=32, kind=prologue */
func_002669F0:
/* 0x002669F0 0x802D65F0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002669F4 0x802D65F4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002669F8 0x802D65F8 0x0C084704 */ .word 0x0C084704 # jal 0x80211C10
/* 0x002669FC 0x802D65FC 0x24840018 */ .word 0x24840018 # addiu $a0, $a0, 0x18
/* 0x00266A00 0x802D6600 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00266A04 0x802D6604 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00266A08 0x802D6608 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00266A0C 0x802D660C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
