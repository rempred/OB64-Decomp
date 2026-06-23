/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021D784..0x0021D7A8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan: lui$a1,0x3DCC / ori$a1,0xCCCD (0.1f) at 0x21D784-0x21D788 are a read-before-write preamble; the body at 0x21D78C (addiu$sp,-0x18; sw$ra; jal 0x801DA180; nop) passes $a1 without setting it. True entry = preamble start. jr$ra@0x21D7A0, delay@0x21D7A4. */
func_0021D784:
/* 0x0021D784 0x8028D384 0x3C053DCC */ .word 0x3C053DCC # lui $a1, 0x3DCC
/* 0x0021D788 0x8028D388 0x34A5CCCD */ .word 0x34A5CCCD # ori $a1, $a1, 0xCCCD

/* function boundary candidate: func_0021D78C, size=28, kind=prologue */
func_0021D78C:
/* 0x0021D78C 0x8028D38C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0021D790 0x8028D390 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0021D794 0x8028D394 0x0C076860 */ .word 0x0C076860 # jal 0x801DA180
/* 0x0021D798 0x8028D398 0x00000000 */ .word 0x00000000 # nop
/* 0x0021D79C 0x8028D39C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0021D7A0 0x8028D3A0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021D7A4 0x8028D3A4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
