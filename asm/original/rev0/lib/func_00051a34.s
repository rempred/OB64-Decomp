/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x00051A34..0x00051A50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merge: parent over-merged 0x51A34..0x51CC8. Tiny stub: addiu $sp,-0x18; jal; jr $ra at 0x51A48 + delay 0x51A4C. New frameless leaf follows at 0x51A50. */
/* function boundary candidate: func_00051A34, size=28, kind=prologue */
func_00051A34:
/* 0x00051A34 0x800C1634 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00051A38 0x800C1638 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00051A3C 0x800C163C 0x0C067122 */ .word 0x0C067122 # jal 0x8019C488
/* 0x00051A40 0x800C1640 0x8C840010 */ .word 0x8C840010 # lw $a0, 0x10($a0)
/* 0x00051A44 0x800C1644 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00051A48 0x800C1648 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00051A4C 0x800C164C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
