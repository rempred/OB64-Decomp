/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001EF8F0..0x001EF928 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Font/glyph-order ALPHABET string, 14 words / 56 bytes: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.3&," (no NUL terminator; 0x2E='.', 0x33='3', 0x26='&', 0x2C=','). Maps glyph slot index to displayed character.. */
/* 0x001EF8F0 0x8025F4F0 0x41424344 */ .word 0x41424344 # cop0_0x0A
/* 0x001EF8F4 0x8025F4F4 0x45464748 */ .word 0x45464748 # round.l.fmt10 $f29, $f8
/* 0x001EF8F8 0x8025F4F8 0x494A4B4C */ .word 0x494A4B4C # op_0x12
/* 0x001EF8FC 0x8025F4FC 0x4D4E4F50 */ .word 0x4D4E4F50 # op_0x13
/* 0x001EF900 0x8025F500 0x51525354 */ .word 0x51525354 # beql $t2, $s2, 0x80274254
/* 0x001EF904 0x8025F504 0x55565758 */ .word 0x55565758 # bnel $t2, $s6, 0x80275268
/* 0x001EF908 0x8025F508 0x595A6162 */ .word 0x595A6162 # blezl $t2, 0x80277A94
/* 0x001EF90C 0x8025F50C 0x63646566 */ .word 0x63646566 # daddi $a0, $k1, 0x6566
/* 0x001EF910 0x8025F510 0x6768696A */ .word 0x6768696A # daddiu $t0, $k1, 0x696A
/* 0x001EF914 0x8025F514 0x6B6C6D6E */ .word 0x6B6C6D6E # ldl $t4, 0x6D6E($k1)
/* 0x001EF918 0x8025F518 0x6F707172 */ .word 0x6F707172 # ldr $s0, 0x7172($k1)
/* 0x001EF91C 0x8025F51C 0x73747576 */ .word 0x73747576 # op_0x1C
/* 0x001EF920 0x8025F520 0x7778797A */ .word 0x7778797A # op_0x1D
/* 0x001EF924 0x8025F524 0x2E33262C */ .word 0x2E33262C # sltiu $s3, $s1, 0x262C
