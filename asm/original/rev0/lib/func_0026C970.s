/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026C970..0x0026C994 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small wrapper: lw $a0,0($a0); jal 0x80093060 (memcpy-like, 0x50 bytes); ends jr$ra@0026C98C + addiu$sp delay@0026C990. */
/* function boundary candidate: func_0026C970, size=36, kind=prologue */
func_0026C970:
/* 0x0026C970 0x802DC570 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026C974 0x802DC574 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026C978 0x802DC578 0x8C840000 */ .word 0x8C840000 # lw $a0, 0x0($a0)
/* 0x0026C97C 0x802DC57C 0x24060050 */ .word 0x24060050 # addiu $a2, $zero, 0x50
/* 0x0026C980 0x802DC580 0x0C024C18 */ .word 0x0C024C18 # jal 0x80093060
/* 0x0026C984 0x802DC584 0x24840044 */ .word 0x24840044 # addiu $a0, $a0, 0x44
/* 0x0026C988 0x802DC588 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026C98C 0x802DC58C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026C990 0x802DC590 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
