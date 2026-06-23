/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F150..0x0025F178 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless FP leaf missed by plan (parent over-merged into func_0025F080). move $v1,$zero; lwc1 $f0,0($a1); swc1 $f0,0x30($a0); loop count 3 (copies 3 floats into a +0x30 field). jr $ra at 0x0025F170 + delay nop 0x0025F174. */
/* 0x0025F150 0x802CED50 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0025F154 0x802CED54 0xC4A00000 */ .word 0xC4A00000 # lwc1 $f0, 0x0($a1)
/* 0x0025F158 0x802CED58 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x0025F15C 0x802CED5C 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0025F160 0x802CED60 0x28620003 */ .word 0x28620003 # slti $v0, $v1, 0x3
/* 0x0025F164 0x802CED64 0xE4800030 */ .word 0xE4800030 # swc1 $f0, 0x30($a0)
/* 0x0025F168 0x802CED68 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x802CED54
/* 0x0025F16C 0x802CED6C 0x24840004 */ .word 0x24840004 # addiu $a0, $a0, 0x4
/* 0x0025F170 0x802CED70 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F174 0x802CED74 0x00000000 */ .word 0x00000000 # nop
