/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A4BE0..0x001A4C10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Inline data island part 3: IEEE-754 DOUBLE constant pool over [0x1A4BE0,0x1A4C10). Doubles: 0x3FF7333333333333 (=1.45) and 0x3FF3333333333333 (=1.2) @0x1A4BE0..0x1A4C00, then 0x401921FB54442D18 (=2*pi, 6.283185307) @0x1A4C00..0x1A4C08, then two 0x00000000 alignment words @0x1A4C08..0x1A4C10. The next owner (func_001A4C10) begins at 0x1A4C10. */
/* 0x001A4BE0 0x802147E0 0x3FF73333 */ .word 0x3FF73333 # lui $s7, 0x3333
/* 0x001A4BE4 0x802147E4 0x33333333 */ .word 0x33333333 # andi $s3, $t9, 0x3333
/* 0x001A4BE8 0x802147E8 0x3FF33333 */ .word 0x3FF33333 # lui $s3, 0x3333
/* 0x001A4BEC 0x802147EC 0x33333333 */ .word 0x33333333 # andi $s3, $t9, 0x3333
/* 0x001A4BF0 0x802147F0 0x3FF73333 */ .word 0x3FF73333 # lui $s7, 0x3333
/* 0x001A4BF4 0x802147F4 0x33333333 */ .word 0x33333333 # andi $s3, $t9, 0x3333
/* 0x001A4BF8 0x802147F8 0x3FF33333 */ .word 0x3FF33333 # lui $s3, 0x3333
/* 0x001A4BFC 0x802147FC 0x33333333 */ .word 0x33333333 # andi $s3, $t9, 0x3333
/* 0x001A4C00 0x80214800 0x401921FB */ .word 0x401921FB # mfc0 $t9, $4
/* 0x001A4C04 0x80214804 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8021FC68
/* 0x001A4C08 0x80214808 0x00000000 */ .word 0x00000000 # nop
/* 0x001A4C0C 0x8021480C 0x00000000 */ .word 0x00000000 # nop
