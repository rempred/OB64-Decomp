/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00229964..0x002299A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII format-string pool + control codes: "%s cannot be used.\x00", control-code tokens "{C6}\x00","{C14}\x00", interleaved float-looking words 0x40704000 (=3.7539...) with nop padding.. */
/* 0x00229964 0x80299564 0x25732063 */ .word 0x25732063 # addiu $s3, $t3, 0x2063
/* 0x00229968 0x80299568 0x616E6E6F */ .word 0x616E6E6F # daddi $t6, $t3, 0x6E6F
/* 0x0022996C 0x8029956C 0x74206265 */ .word 0x74206265 # op_0x1D
/* 0x00229970 0x80299570 0x20757365 */ .word 0x20757365 # addi $s5, $v1, 0x7365
/* 0x00229974 0x80299574 0x642E0000 */ .word 0x642E0000 # daddiu $t6, $at, 0x0
/* 0x00229978 0x80299578 0x40704000 */ .word 0x40704000 # cop0_0x03
/* 0x0022997C 0x8029957C 0x00000000 */ .word 0x00000000 # nop
/* 0x00229980 0x80299580 0x40704000 */ .word 0x40704000 # cop0_0x03
/* 0x00229984 0x80299584 0x00000000 */ .word 0x00000000 # nop
/* 0x00229988 0x80299588 0x40704000 */ .word 0x40704000 # cop0_0x03
/* 0x0022998C 0x8029958C 0x00000000 */ .word 0x00000000 # nop
/* 0x00229990 0x80299590 0x7B43367D */ .word 0x7B43367D # op_0x1E
/* 0x00229994 0x80299594 0x00000000 */ .word 0x00000000 # nop
/* 0x00229998 0x80299598 0x7B433134 */ .word 0x7B433134 # op_0x1E
/* 0x0022999C 0x8029959C 0x7D000000 */ .word 0x7D000000 # op_0x1F
