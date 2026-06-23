/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142BA0..0x00142BB8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string 'There is NO-TEXT.' + newline (0x54686572='Ther' .. 0x204E4F2D=' NO-', 0x2E0A0000='.',LF,NUL). 1 trailing zero word. [name-token: rodata_str_NO_TEXT]. */
/* 0x00142BA0 0x801B27A0 0x54686572 */ .word 0x54686572 # bnel $v1, $t0, 0x801CBD6C
/* 0x00142BA4 0x801B27A4 0x65206973 */ .word 0x65206973 # daddiu $zero, $t1, 0x6973
/* 0x00142BA8 0x801B27A8 0x204E4F2D */ .word 0x204E4F2D # addi $t6, $v0, 0x4F2D
/* 0x00142BAC 0x801B27AC 0x54455854 */ .word 0x54455854 # bnel $v0, $a1, 0x801C8900
/* 0x00142BB0 0x801B27B0 0x2E0A0000 */ .word 0x2E0A0000 # sltiu $t2, $s0, 0x0
/* 0x00142BB4 0x801B27B4 0x00000000 */ .word 0x00000000 # nop
