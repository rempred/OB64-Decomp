/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00243EE8..0x00243F14 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Final function. Prologue addiu $sp,-0x18 @0x00243EE8; spin loop calling 0x801EF7AC until $v0==0; returns jr $ra @0x00243F0C + delay addiu $sp,0x18 @0x00243F10. Slice ends exactly at 0x00243F14 (data island begins there). */
/* function boundary candidate: func_00243EE8, size=44, kind=prologue */
func_00243EE8:
/* 0x00243EE8 0x802B3AE8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00243EEC 0x802B3AEC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00243EF0 0x802B3AF0 0x0C022684 */ .word 0x0C022684 # jal 0x80089A10
/* 0x00243EF4 0x802B3AF4 0x00000000 */ .word 0x00000000 # nop
/* 0x00243EF8 0x802B3AF8 0x0C07BDEB */ .word 0x0C07BDEB # jal 0x801EF7AC
/* 0x00243EFC 0x802B3AFC 0x00000000 */ .word 0x00000000 # nop
/* 0x00243F00 0x802B3B00 0x1040FFFB */ .word 0x1040FFFB # beq $v0, $zero, 0x802B3AF0
/* 0x00243F04 0x802B3B04 0x00000000 */ .word 0x00000000 # nop
/* 0x00243F08 0x802B3B08 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00243F0C 0x802B3B0C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00243F10 0x802B3B10 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
