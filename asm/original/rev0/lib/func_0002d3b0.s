/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002D3B0..0x0002D3E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0002D3B0, size=40, kind=prologue */
func_0002D3B0:
/* 0x0002D3B0 0x8009CFB0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0002D3B4 0x8009CFB4 0x3C013F80 */ .word 0x3C013F80 # lui $at, 0x3F80
/* 0x0002D3B8 0x8009CFB8 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0002D3BC 0x8009CFBC 0x44817000 */ .word 0x44817000 # mtc1 $at, $f14
/* 0x0002D3C0 0x8009CFC0 0x0C0273F8 */ .word 0x0C0273F8 # jal 0x8009CFE0
/* 0x0002D3C4 0x8009CFC4 0x00000000 */ .word 0x00000000 # nop
/* 0x0002D3C8 0x8009CFC8 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0002D3CC 0x8009CFCC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0002D3D0 0x8009CFD0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002D3D4 0x8009CFD4 0x00000000 */ .word 0x00000000 # nop
/* 0x0002D3D8 0x8009CFD8 0x00000000 */ .word 0x00000000 # nop
/* 0x0002D3DC 0x8009CFDC 0x00000000 */ .word 0x00000000 # nop
