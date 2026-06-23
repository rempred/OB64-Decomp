/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142A50..0x00142A70 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string 'vtx_cnt number over :%d' + newline (0x7674785F='vtx_' .. 0x3A202564=': %d',LF,NUL). Zero-padded. [name-token: rodata_str_vtx_cnt]. */
/* 0x00142A50 0x801B2650 0x7674785F */ .word 0x7674785F # op_0x1D
/* 0x00142A54 0x801B2654 0x636E7420 */ .word 0x636E7420 # daddi $t6, $k1, 0x7420
/* 0x00142A58 0x801B2658 0x6E756D62 */ .word 0x6E756D62 # ldr $s5, 0x6D62($s3)
/* 0x00142A5C 0x801B265C 0x6572206F */ .word 0x6572206F # daddiu $s2, $t3, 0x206F
/* 0x00142A60 0x801B2660 0x76657220 */ .word 0x76657220 # op_0x1D
/* 0x00142A64 0x801B2664 0x3A202564 */ .word 0x3A202564 # xori $zero, $s1, 0x2564
/* 0x00142A68 0x801B2668 0x0A000000 */ .word 0x0A000000 # j 0x88000000
/* 0x00142A6C 0x801B266C 0x00000000 */ .word 0x00000000 # nop
