/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024C3EC..0x0024C428 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame -0x18. jal 0x801C8FE8 then computes 3*v1+a0+0x14 sign-extended halfword result. jr $ra at 0x0024C420 + delay (addiu $sp,0x18) at 0x0024C424. */
/* function boundary candidate: func_0024C3EC, size=60, kind=prologue */
func_0024C3EC:
/* 0x0024C3EC 0x802BBFEC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0024C3F0 0x802BBFF0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0024C3F4 0x802BBFF4 0x0C0723FA */ .word 0x0C0723FA # jal 0x801C8FE8
/* 0x0024C3F8 0x802BBFF8 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0024C3FC 0x802BBFFC 0x8C430058 */ .word 0x8C430058 # lw $v1, 0x58($v0)
/* 0x0024C400 0x802BC000 0x8C440054 */ .word 0x8C440054 # lw $a0, 0x54($v0)
/* 0x0024C404 0x802BC004 0x00031040 */ .word 0x00031040 # sll $v0, $v1, 1
/* 0x0024C408 0x802BC008 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0024C40C 0x802BC00C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0024C410 0x802BC010 0x24420014 */ .word 0x24420014 # addiu $v0, $v0, 0x14
/* 0x0024C414 0x802BC014 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x0024C418 0x802BC018 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0024C41C 0x802BC01C 0x00021403 */ .word 0x00021403 # sra $v0, $v0, 16
/* 0x0024C420 0x802BC020 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024C424 0x802BC024 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
