/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F058..0x0025F080 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless FP leaf missed by plan (parent over-merged into func_0025EFC8). move $v1,$zero; lwc1 $f0,0($a0); swc1 to $a1; loop count 0x10 (copies 16 floats from $a0 to $a1). jr $ra at 0x0025F078 + delay nop 0x0025F07C. */
/* 0x0025F058 0x802CEC58 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0025F05C 0x802CEC5C 0xC4800000 */ .word 0xC4800000 # lwc1 $f0, 0x0($a0)
/* 0x0025F060 0x802CEC60 0x24840004 */ .word 0x24840004 # addiu $a0, $a0, 0x4
/* 0x0025F064 0x802CEC64 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0025F068 0x802CEC68 0x28620010 */ .word 0x28620010 # slti $v0, $v1, 0x10
/* 0x0025F06C 0x802CEC6C 0xE4A00000 */ .word 0xE4A00000 # swc1 $f0, 0x0($a1)
/* 0x0025F070 0x802CEC70 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x802CEC5C
/* 0x0025F074 0x802CEC74 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x0025F078 0x802CEC78 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F07C 0x802CEC7C 0x00000000 */ .word 0x00000000 # nop
