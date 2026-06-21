/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002CB80..0x0002CBC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002CB80 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
hypotf:
/* function boundary candidate: func_0002CB80, size=52, kind=prologue */
func_0002CB80:
/* 0x0002CB80 0x8009C780 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0002CB84 0x8009C784 0xE7AC0018 */ .word 0xE7AC0018 # swc1 $f12, 0x18($sp)
/* 0x0002CB88 0x8009C788 0xC7A40018 */ .word 0xC7A40018 # lwc1 $f4, 0x18($sp)
/* 0x0002CB8C 0x8009C78C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0002CB90 0x8009C790 0x46042182 */ .word 0x46042182 # mul.s $f6, $f4, $f4
/* 0x0002CB94 0x8009C794 0x00000000 */ .word 0x00000000 # nop
/* 0x0002CB98 0x8009C798 0x460E7202 */ .word 0x460E7202 # mul.s $f8, $f14, $f14
/* 0x0002CB9C 0x8009C79C 0x0C0241F8 */ .word 0x0C0241F8 # jal 0x800907E0
/* 0x0002CBA0 0x8009C7A0 0x46083300 */ .word 0x46083300 # add.s $f12, $f6, $f8
/* 0x0002CBA4 0x8009C7A4 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0002CBA8 0x8009C7A8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0002CBAC 0x8009C7AC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002CBB0 0x8009C7B0 0x00000000 */ .word 0x00000000 # nop
/* 0x0002CBB4 0x8009C7B4 0x00000000 */ .word 0x00000000 # nop
/* 0x0002CBB8 0x8009C7B8 0x00000000 */ .word 0x00000000 # nop
/* 0x0002CBBC 0x8009C7BC 0x00000000 */ .word 0x00000000 # nop
