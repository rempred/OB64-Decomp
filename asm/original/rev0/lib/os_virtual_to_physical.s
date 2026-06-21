/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00020B80..0x00020BE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00020B80 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
os_virtual_to_physical:
/* function boundary candidate: func_00020B80, size=84, kind=prologue */
func_00020B80:
/* 0x00020B80 0x80090780 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00020B84 0x80090784 0x3C031FFF */ .word 0x3C031FFF # lui $v1, 0x1FFF
/* 0x00020B88 0x80090788 0x3463FFFF */ .word 0x3463FFFF # ori $v1, $v1, 0xFFFF
/* 0x00020B8C 0x8009078C 0x3C028000 */ .word 0x3C028000 # lui $v0, 0x8000
/* 0x00020B90 0x80090790 0x00821023 */ .word 0x00821023 # subu $v0, $a0, $v0
/* 0x00020B94 0x80090794 0x0062102B */ .word 0x0062102B # sltu $v0, $v1, $v0
/* 0x00020B98 0x80090798 0x1040000A */ .word 0x1040000A # beq $v0, $zero, 0x800907C4
/* 0x00020B9C 0x8009079C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00020BA0 0x800907A0 0x3C026000 */ .word 0x3C026000 # lui $v0, 0x6000
/* 0x00020BA4 0x800907A4 0x00821021 */ .word 0x00821021 # addu $v0, $a0, $v0
/* 0x00020BA8 0x800907A8 0x0062102B */ .word 0x0062102B # sltu $v0, $v1, $v0
/* 0x00020BAC 0x800907AC 0x10400006 */ .word 0x10400006 # beq $v0, $zero, 0x800907C8
/* 0x00020BB0 0x800907B0 0x00831024 */ .word 0x00831024 # and $v0, $a0, $v1
/* 0x00020BB4 0x800907B4 0x0C025438 */ .word 0x0C025438 # jal 0x800950E0
/* 0x00020BB8 0x800907B8 0x00000000 */ .word 0x00000000 # nop
/* 0x00020BBC 0x800907BC 0x080241F2 */ .word 0x080241F2 # j 0x800907C8
/* 0x00020BC0 0x800907C0 0x00000000 */ .word 0x00000000 # nop
/* 0x00020BC4 0x800907C4 0x00831024 */ .word 0x00831024 # and $v0, $a0, $v1
/* 0x00020BC8 0x800907C8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00020BCC 0x800907CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00020BD0 0x800907D0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x00020BD4 0x800907D4 0x00000000 */ .word 0x00000000 # nop
/* 0x00020BD8 0x800907D8 0x00000000 */ .word 0x00000000 # nop
/* 0x00020BDC 0x800907DC 0x00000000 */ .word 0x00000000 # nop
