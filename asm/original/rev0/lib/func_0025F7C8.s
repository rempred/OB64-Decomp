/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F7C8..0x0025F7F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame -0x18, saves $ra. jal 0x801C8FE8; lw $v0,0x64($v0). jr$ra at 0x0025F7E0 + delay addiu$sp; trailing align nops 0x0025F7E8/0x0025F7EC attach here. */
/* function boundary candidate: func_0025F7C8, size=32, kind=prologue */
func_0025F7C8:
/* 0x0025F7C8 0x802CF3C8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0025F7CC 0x802CF3CC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0025F7D0 0x802CF3D0 0x0C0723FA */ .word 0x0C0723FA # jal 0x801C8FE8
/* 0x0025F7D4 0x802CF3D4 0x00000000 */ .word 0x00000000 # nop
/* 0x0025F7D8 0x802CF3D8 0x8C420064 */ .word 0x8C420064 # lw $v0, 0x64($v0)
/* 0x0025F7DC 0x802CF3DC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0025F7E0 0x802CF3E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F7E4 0x802CF3E4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0025F7E8 0x802CF3E8 0x00000000 */ .word 0x00000000 # nop
/* 0x0025F7EC 0x802CF3EC 0x00000000 */ .word 0x00000000 # nop
