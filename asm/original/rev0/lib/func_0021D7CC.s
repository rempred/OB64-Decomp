/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021D7CC..0x0021D7F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Wrapper: addiu$sp,-0x18; sw$ra; jal 0x801DA180; move$a1,$zero (delay slot sets float arg = 0). No leading preamble. jr$ra@0x21D7E0, delay@0x21D7E4, two alignment nops @0x21D7E8/0x21D7EC attach to end. */
/* function boundary candidate: func_0021D7CC, size=28, kind=prologue */
func_0021D7CC:
/* 0x0021D7CC 0x8028D3CC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0021D7D0 0x8028D3D0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0021D7D4 0x8028D3D4 0x0C076860 */ .word 0x0C076860 # jal 0x801DA180
/* 0x0021D7D8 0x8028D3D8 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0021D7DC 0x8028D3DC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0021D7E0 0x8028D3E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021D7E4 0x8028D3E4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0021D7E8 0x8028D3E8 0x00000000 */ .word 0x00000000 # nop
/* 0x0021D7EC 0x8028D3EC 0x00000000 */ .word 0x00000000 # nop
