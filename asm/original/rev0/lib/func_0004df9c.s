/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DF9C..0x0004DFCC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue, jr $ra at 0x0004DFC4 + delay 0x0004DFC8 */
/* function boundary candidate: func_0004DF9C, size=48, kind=prologue */
func_0004DF9C:
/* 0x0004DF9C 0x800BDB9C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DFA0 0x800BDBA0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DFA4 0x800BDBA4 0x0C06D709 */ .word 0x0C06D709 # jal 0x801B5C24
/* 0x0004DFA8 0x800BDBA8 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DFAC 0x800BDBAC 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x0004DFB0 0x800BDBB0 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800BDBC0
/* 0x0004DFB4 0x800BDBB4 0x3402FFFD */ .word 0x3402FFFD # ori $v0, $zero, 0xFFFD
/* 0x0004DFB8 0x800BDBB8 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0004DFBC 0x800BDBBC 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x0004DFC0 0x800BDBC0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DFC4 0x800BDBC4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DFC8 0x800BDBC8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
