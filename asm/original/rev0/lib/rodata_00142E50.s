/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142E50..0x00142E70 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII error string 0x4D656D45='MemE' .. 0x6E642829='nd()',LF,NUL. Zero-padded. [name-token: rodata_str_MemError_spDepend]. */
/* 0x00142E50 0x801B2A50 0x4D656D45 */ .word 0x4D656D45 # op_0x13
/* 0x00142E54 0x801B2A54 0x72726F72 */ .word 0x72726F72 # op_0x1C
/* 0x00142E58 0x801B2A58 0x206F6E20 */ .word 0x206F6E20 # addi $t7, $v1, 0x6E20
/* 0x00142E5C 0x801B2A5C 0x53657444 */ .word 0x53657444 # beql $k1, $a1, 0x801CFB70
/* 0x00142E60 0x801B2A60 0x65616445 */ .word 0x65616445 # daddiu $at, $t3, 0x6445
/* 0x00142E64 0x801B2A64 0x6E642829 */ .word 0x6E642829 # ldr $a0, 0x2829($s3)
/* 0x00142E68 0x801B2A68 0x0A000000 */ .word 0x0A000000 # j 0x88000000
/* 0x00142E6C 0x801B2A6C 0x00000000 */ .word 0x00000000 # nop
