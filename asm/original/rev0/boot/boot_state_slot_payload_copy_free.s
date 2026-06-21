/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00008388_00011000.s
 * z64 range: 0x00008564..0x0000859C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00008564, size=56, kind=prologue */
func_00008564:
/* 0x00008564 0x80078164 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00008568 0x80078168 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x0000856C 0x8007816C 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x00008570 0x80078170 0x12000006 */ .word 0x12000006 # beq $s0, $zero, 0x8007818C
/* 0x00008574 0x80078174 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00008578 0x80078178 0x96060002 */ .word 0x96060002 # lhu $a2, 0x2($s0)
/* 0x0000857C 0x8007817C 0x0C024C18 */ .word 0x0C024C18 # jal 0x80093060
/* 0x00008580 0x80078180 0x26040006 */ .word 0x26040006 # addiu $a0, $s0, 0x6
/* 0x00008584 0x80078184 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00008588 0x80078188 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x0000858C 0x8007818C 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00008590 0x80078190 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00008594 0x80078194 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00008598 0x80078198 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
