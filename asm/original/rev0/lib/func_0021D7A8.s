/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021D7A8..0x0021D7CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan: lui$a1,0xBDCC / ori$a1,0xCCCD (-0.1f) at 0x21D7A8-0x21D7AC; body at 0x21D7B0 (addiu$sp,-0x18; sw$ra; jal 0x801DA180; nop) reads $a1 before writing. jr$ra@0x21D7C4, delay@0x21D7C8. */
func_0021D7A8:
/* 0x0021D7A8 0x8028D3A8 0x3C05BDCC */ .word 0x3C05BDCC # lui $a1, 0xBDCC
/* 0x0021D7AC 0x8028D3AC 0x34A5CCCD */ .word 0x34A5CCCD # ori $a1, $a1, 0xCCCD

/* function boundary candidate: func_0021D7B0, size=28, kind=prologue */
func_0021D7B0:
/* 0x0021D7B0 0x8028D3B0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0021D7B4 0x8028D3B4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0021D7B8 0x8028D3B8 0x0C076860 */ .word 0x0C076860 # jal 0x801DA180
/* 0x0021D7BC 0x8028D3BC 0x00000000 */ .word 0x00000000 # nop
/* 0x0021D7C0 0x8028D3C0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0021D7C4 0x8028D3C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021D7C8 0x8028D3C8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
