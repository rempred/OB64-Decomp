/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A3150..0x002A3198 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless-ish accessor frame 0x18. j 0x80233958 internal tail-jump. jr $ra at 0x002A3190, delay slot addiu $sp,0x18 at 0x002A3194 ends the slice at 0x002A3198. */
/* function boundary candidate: func_002A3150, size=72, kind=prologue */
func_002A3150:
/* 0x002A3150 0x80312D50 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002A3154 0x80312D54 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x002A3158 0x80312D58 0x00A08021 */ .word 0x00A08021 # move $s0, $a1
/* 0x002A315C 0x80312D5C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x002A3160 0x80312D60 0x0C08CB91 */ .word 0x0C08CB91 # jal 0x80232E44
/* 0x002A3164 0x80312D64 0x00C02821 */ .word 0x00C02821 # move $a1, $a2
/* 0x002A3168 0x80312D68 0x00401821 */ .word 0x00401821 # move $v1, $v0
/* 0x002A316C 0x80312D6C 0x14600003 */ .word 0x14600003 # bne $v1, $zero, 0x80312D7C
/* 0x002A3170 0x80312D70 0x00101080 */ .word 0x00101080 # sll $v0, $s0, 2
/* 0x002A3174 0x80312D74 0x0808CE56 */ .word 0x0808CE56 # j 0x80233958
/* 0x002A3178 0x80312D78 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002A317C 0x80312D7C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x002A3180 0x80312D80 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x002A3184 0x80312D84 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x002A3188 0x80312D88 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x002A318C 0x80312D8C 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x002A3190 0x80312D90 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A3194 0x80312D94 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
