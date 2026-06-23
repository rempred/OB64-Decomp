/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0088..0x001F00B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): printf format-string pool (preceded by 8 zero bytes): "%s Scene %d\x00" (0x1F008C), "999:59:59\x00" (0x1F0098), "%d:%02d:%02d\x00" (0x1F00A4), then 8 bytes zero padding to 0x1F00B8.. */
/* 0x001F0088 0x8025FC88 0x00000000 */ .word 0x00000000 # nop
/* 0x001F008C 0x8025FC8C 0x25732053 */ .word 0x25732053 # addiu $s3, $t3, 0x2053
/* 0x001F0090 0x8025FC90 0x63656E65 */ .word 0x63656E65 # daddi $a1, $k1, 0x6E65
/* 0x001F0094 0x8025FC94 0x20256400 */ .word 0x20256400 # addi $a1, $at, 0x6400
/* 0x001F0098 0x8025FC98 0x3939393A */ .word 0x3939393A # xori $t9, $t1, 0x393A
/* 0x001F009C 0x8025FC9C 0x35393A35 */ .word 0x35393A35 # ori $t9, $t1, 0x3A35
/* 0x001F00A0 0x8025FCA0 0x39000000 */ .word 0x39000000 # xori $zero, $t0, 0x0000
/* 0x001F00A4 0x8025FCA4 0x25643A25 */ .word 0x25643A25 # addiu $a0, $t3, 0x3A25
/* 0x001F00A8 0x8025FCA8 0x3032643A */ .word 0x3032643A # andi $s2, $at, 0x643A
/* 0x001F00AC 0x8025FCAC 0x25303264 */ .word 0x25303264 # addiu $s0, $t1, 0x3264
/* 0x001F00B0 0x8025FCB0 0x00000000 */ .word 0x00000000 # nop
/* 0x001F00B4 0x8025FCB4 0x00000000 */ .word 0x00000000 # nop
