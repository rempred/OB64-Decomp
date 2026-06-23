/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026E620..0x0026E64C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small frame addiu $sp,-0x18 leaf; stores $a0 to 0x80220F68; ends jr $ra@0x0026E644 + delay @0x0026E648. */
/* function boundary candidate: func_0026E620, size=44, kind=prologue */
func_0026E620:
/* 0x0026E620 0x802DE220 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026E624 0x802DE224 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026E628 0x802DE228 0xAC240F68 */ .word 0xAC240F68 # sw $a0, 0xF68($at)
/* 0x0026E62C 0x802DE22C 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x0026E630 0x802DE230 0x2484A57C */ .word 0x2484A57C # addiu $a0, $a0, -0x5A84
/* 0x0026E634 0x802DE234 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026E638 0x802DE238 0x0C0837C0 */ .word 0x0C0837C0 # jal 0x8020DF00
/* 0x0026E63C 0x802DE23C 0x00000000 */ .word 0x00000000 # nop
/* 0x0026E640 0x802DE240 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026E644 0x802DE244 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026E648 0x802DE248 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
