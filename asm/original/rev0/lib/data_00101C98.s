/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101C98..0x00101CC8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE-754 big-endian FLOAT64 (double) constant pool. 0x3FF00000_00000000 = 1.0; 0x40668000_00000000 = 180.0; 0x400921FB_54442D18 = pi (3.14159265358979); 0x3FF921FB_54442D18 = pi/2 (1.5707963...). Followed by three small-int pairs not parsed as doubles: 0x00070009, 0x000B000D, 0x000F0000 (looks like packed 16-bit ints 7,9,11,13,15,0 -> embedded table within pool, hypothesis), then 0x00000000 pad word at 0x101CC4. [name-token: float_double_const_pool]. */
/* 0x00101C98 0x80171898 0x3FF00000 */ .word 0x3FF00000 # lui $s0, 0x0000
/* 0x00101C9C 0x8017189C 0x00000000 */ .word 0x00000000 # nop
/* 0x00101CA0 0x801718A0 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x00101CA4 0x801718A4 0x00000000 */ .word 0x00000000 # nop
/* 0x00101CA8 0x801718A8 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00101CAC 0x801718AC 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8017CD10
/* 0x00101CB0 0x801718B0 0x3FF921FB */ .word 0x3FF921FB # lui $t9, 0x21FB
/* 0x00101CB4 0x801718B4 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8017CD18
/* 0x00101CB8 0x801718B8 0x00070009 */ .word 0x00070009 # jalr $zero, $zero
/* 0x00101CBC 0x801718BC 0x000B000D */ .word 0x000B000D # break 0x02C00
/* 0x00101CC0 0x801718C0 0x000F0000 */ .word 0x000F0000 # sll $zero, $t7, 0
/* 0x00101CC4 0x801718C4 0x00000000 */ .word 0x00000000 # nop
