/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004D600..0x0004D628 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x4D620 + delay 0x4D624. Un-merged from parent file 87. */
/* function boundary candidate: func_0004D600, size=52, kind=prologue */
func_0004D600:
/* 0x0004D600 0x800BD200 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004D604 0x800BD204 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004D608 0x800BD208 0x0C066020 */ .word 0x0C066020 # jal 0x80198080
/* 0x0004D60C 0x800BD20C 0x24040029 */ .word 0x24040029 # addiu $a0, $zero, 0x29
/* 0x0004D610 0x800BD210 0x34028014 */ .word 0x34028014 # ori $v0, $zero, 0x8014
/* 0x0004D614 0x800BD214 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0004D618 0x800BD218 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x0004D61C 0x800BD21C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004D620 0x800BD220 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004D624 0x800BD224 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
