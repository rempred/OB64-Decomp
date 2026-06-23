/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DC600..0x000DC630 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Float-constant block (IEEE-754): 0x3F866666 (1.05), 0x3F800000 (1.0), 0x3F733333x2 (0.95), 0x3F800000, 0x3F866666, then 0x400921FA/0xFC8B007A (double pi 3.14159... as hi/lo words), 0x40668000 (3.6125), 0x00000000, 0x3FE51EB8/0x51EB851F (double ~0.6597). Mixed float32 + float64 constants.. */
/* 0x000DC600 0x8014C200 0x3F866666 */ .word 0x3F866666 # lui $a2, 0x6666
/* 0x000DC604 0x8014C204 0x3F800000 */ .word 0x3F800000 # lui $zero, 0x0000
/* 0x000DC608 0x8014C208 0x3F733333 */ .word 0x3F733333 # lui $s3, 0x3333
/* 0x000DC60C 0x8014C20C 0x3F733333 */ .word 0x3F733333 # lui $s3, 0x3333
/* 0x000DC610 0x8014C210 0x3F800000 */ .word 0x3F800000 # lui $zero, 0x0000
/* 0x000DC614 0x8014C214 0x3F866666 */ .word 0x3F866666 # lui $a2, 0x6666
/* 0x000DC618 0x8014C218 0x400921FA */ .word 0x400921FA # mfc0 $t1, $4
/* 0x000DC61C 0x8014C21C 0xFC8B007A */ .word 0xFC8B007A # sd $t3, 0x7A($a0)
/* 0x000DC620 0x8014C220 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x000DC624 0x8014C224 0x00000000 */ .word 0x00000000 # nop
/* 0x000DC628 0x8014C228 0x3FE51EB8 */ .word 0x3FE51EB8 # lui $a1, 0x1EB8
/* 0x000DC62C 0x8014C22C 0x51EB851F */ .word 0x51EB851F # beql $t7, $t3, 0x8012D6AC
