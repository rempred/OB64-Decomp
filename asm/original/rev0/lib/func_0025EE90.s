/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025EE90..0x0025EEF8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x10; mtc1 $a1 scalar then mul.s loop over 3 floats (scales a vec3 by a scalar, writing to stack then back). jr $ra at 0x0025EEF0 + delay nop 0x0025EEF4. Ends at the preamble start of the next function. */
/* function boundary candidate: func_0025EE90, size=104, kind=prologue */
func_0025EE90:
/* 0x0025EE90 0x802CEA90 0x27BDFFF0 */ .word 0x27BDFFF0 # addiu $sp, $sp, -0x10
/* 0x0025EE94 0x802CEA94 0x44851000 */ .word 0x44851000 # mtc1 $a1, $f2
/* 0x0025EE98 0x802CEA98 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0025EE9C 0x802CEA9C 0x03A02821 */ .word 0x03A02821 # move $a1, $sp
/* 0x0025EEA0 0x802CEAA0 0xC4800000 */ .word 0xC4800000 # lwc1 $f0, 0x0($a0)
/* 0x0025EEA4 0x802CEAA4 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x0025EEA8 0x802CEAA8 0x24840004 */ .word 0x24840004 # addiu $a0, $a0, 0x4
/* 0x0025EEAC 0x802CEAAC 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0025EEB0 0x802CEAB0 0x28620003 */ .word 0x28620003 # slti $v0, $v1, 0x3
/* 0x0025EEB4 0x802CEAB4 0xE4A00000 */ .word 0xE4A00000 # swc1 $f0, 0x0($a1)
/* 0x0025EEB8 0x802CEAB8 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x802CEAA0
/* 0x0025EEBC 0x802CEABC 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x0025EEC0 0x802CEAC0 0x2463FFFF */ .word 0x2463FFFF # addiu $v1, $v1, -0x1
/* 0x0025EEC4 0x802CEAC4 0x04600009 */ .word 0x04600009 # bltz $v1, 0x802CEAEC
/* 0x0025EEC8 0x802CEAC8 0x00031080 */ .word 0x00031080 # sll $v0, $v1, 2
/* 0x0025EECC 0x802CEACC 0x00463021 */ .word 0x00463021 # addu $a2, $v0, $a2
/* 0x0025EED0 0x802CEAD0 0x005D1021 */ .word 0x005D1021 # addu $v0, $v0, $sp
/* 0x0025EED4 0x802CEAD4 0xC4400000 */ .word 0xC4400000 # lwc1 $f0, 0x0($v0)
/* 0x0025EED8 0x802CEAD8 0x2442FFFC */ .word 0x2442FFFC # addiu $v0, $v0, -0x4
/* 0x0025EEDC 0x802CEADC 0x2463FFFF */ .word 0x2463FFFF # addiu $v1, $v1, -0x1
/* 0x0025EEE0 0x802CEAE0 0xE4C00000 */ .word 0xE4C00000 # swc1 $f0, 0x0($a2)
/* 0x0025EEE4 0x802CEAE4 0x0461FFFB */ .word 0x0461FFFB # bgez $v1, 0x802CEAD4
/* 0x0025EEE8 0x802CEAE8 0x24C6FFFC */ .word 0x24C6FFFC # addiu $a2, $a2, -0x4
/* 0x0025EEEC 0x802CEAEC 0x27BD0010 */ .word 0x27BD0010 # addiu $sp, $sp, 0x10
/* 0x0025EEF0 0x802CEAF0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025EEF4 0x802CEAF4 0x00000000 */ .word 0x00000000 # nop
