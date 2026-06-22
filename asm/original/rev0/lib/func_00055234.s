/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x00055234..0x0005526C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (un-merged from parent idx27). Fresh entry after return: lui $v0,0x8019; lw -0x240($v0); list-search loop; jr $ra at 0x00055264 + delay slot 0x00055268. */
func_00055234:
/* 0x00055234 0x800C4E34 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00055238 0x800C4E38 0x8C42FDC0 */ .word 0x8C42FDC0 # lw $v0, -0x240($v0)
/* 0x0005523C 0x800C4E3C 0x8C430004 */ .word 0x8C430004 # lw $v1, 0x4($v0)
/* 0x00055240 0x800C4E40 0x10600008 */ .word 0x10600008 # beq $v1, $zero, 0x800C4E64
/* 0x00055244 0x800C4E44 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00055248 0x800C4E48 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x0005524C 0x800C4E4C 0x94620016 */ .word 0x94620016 # lhu $v0, 0x16($v1)
/* 0x00055250 0x800C4E50 0x50440001 */ .word 0x50440001 # beql $v0, $a0, 0x800C4E58
/* 0x00055254 0x800C4E54 0x00602821 */ .word 0x00602821 # move $a1, $v1
/* 0x00055258 0x800C4E58 0x8C630004 */ .word 0x8C630004 # lw $v1, 0x4($v1)
/* 0x0005525C 0x800C4E5C 0x1460FFFB */ .word 0x1460FFFB # bne $v1, $zero, 0x800C4E4C
/* 0x00055260 0x800C4E60 0x00000000 */ .word 0x00000000 # nop
/* 0x00055264 0x800C4E64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00055268 0x800C4E68 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
