/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00181000_00191000.s
 * z64 range: 0x00182080..0x001820A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small frame: addiu $sp,-0x18 prologue, two tail calls jal 0x80216F3C and jal 0x80217114. jr $ra@0x18209C + delay addiu $sp,0x18@0x1820A0. */
/* function boundary candidate: func_00182080, size=48, kind=prologue */
func_00182080:
/* 0x00182080 0x801F1C80 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00182084 0x801F1C84 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00182088 0x801F1C88 0x0C085BCF */ .word 0x0C085BCF # jal 0x80216F3C
/* 0x0018208C 0x801F1C8C 0x00000000 */ .word 0x00000000 # nop
/* 0x00182090 0x801F1C90 0x0C085C45 */ .word 0x0C085C45 # jal 0x80217114
/* 0x00182094 0x801F1C94 0x00000000 */ .word 0x00000000 # nop
/* 0x00182098 0x801F1C98 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0018209C 0x801F1C9C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001820A0 0x801F1CA0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
