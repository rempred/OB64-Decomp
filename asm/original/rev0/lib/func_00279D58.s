/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00279D58..0x00279DA8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x20. Two jal 0x80225300 calls, andi result. Final function of CODE region 2: jr$ra@0x00279DA0 + delay addiu$sp@0x00279DA4 lands exactly at 0x00279DA8 (DATA B follows). */
/* function boundary candidate: func_00279D58, size=80, kind=prologue */
func_00279D58:
/* 0x00279D58 0x802E9958 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x00279D5C 0x802E995C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00279D60 0x802E9960 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x00279D64 0x802E9964 0xAFB10014 */ .word 0xAFB10014 # sw $s1, 0x14($sp)
/* 0x00279D68 0x802E9968 0x00A08821 */ .word 0x00A08821 # move $s1, $a1
/* 0x00279D6C 0x802E996C 0xAFB20018 */ .word 0xAFB20018 # sw $s2, 0x18($sp)
/* 0x00279D70 0x802E9970 0xAFBF001C */ .word 0xAFBF001C # sw $ra, 0x1C($sp)
/* 0x00279D74 0x802E9974 0x0C0894C0 */ .word 0x0C0894C0 # jal 0x80225300
/* 0x00279D78 0x802E9978 0x00C09021 */ .word 0x00C09021 # move $s2, $a2
/* 0x00279D7C 0x802E997C 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00279D80 0x802E9980 0x02202821 */ .word 0x02202821 # move $a1, $s1
/* 0x00279D84 0x802E9984 0x0C0894C0 */ .word 0x0C0894C0 # jal 0x80225300
/* 0x00279D88 0x802E9988 0x26460050 */ .word 0x26460050 # addiu $a2, $s2, 0x50
/* 0x00279D8C 0x802E998C 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
/* 0x00279D90 0x802E9990 0x8FBF001C */ .word 0x8FBF001C # lw $ra, 0x1C($sp)
/* 0x00279D94 0x802E9994 0x8FB20018 */ .word 0x8FB20018 # lw $s2, 0x18($sp)
/* 0x00279D98 0x802E9998 0x8FB10014 */ .word 0x8FB10014 # lw $s1, 0x14($sp)
/* 0x00279D9C 0x802E999C 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00279DA0 0x802E99A0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00279DA4 0x802E99A4 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
