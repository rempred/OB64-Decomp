/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x0013DD74..0x0013DDB4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Continuation of the descending/packed-byte block. Raw words 0x5B875B09 @0x13DD74, 0x5B475B45,0x53455307...; further down 0x294B2109 lands @0x140180. The parent wiki battle-trace labels 0x13DD74/0x13EE90/0x140180 'combat code' -- DISCREDITED linear-map fallacy; these are packed DATA bytes, NOT instructions. [name-token: data_0013DD74_packed_NOT_code]. */
/* 0x0013DD74 0x801AD974 0x5B875B09 */ .word 0x5B875B09 # blezl $gp, 0x801C459C
/* 0x0013DD78 0x801AD978 0x5B475B45 */ .word 0x5B475B45 # blezl $k0, 0x801C4690
/* 0x0013DD7C 0x801AD97C 0x53455307 */ .word 0x53455307 # beql $k0, $a1, 0x801C259C
/* 0x0013DD80 0x801AD980 0x53054B05 */ .word 0x53054B05 # beql $t8, $a1, 0x801C0598
/* 0x0013DD84 0x801AD984 0x52C54AC5 */ .word 0x52C54AC5 # beql $s6, $a1, 0x801C049C
/* 0x0013DD88 0x801AD988 0x42434185 */ .word 0x42434185 # cop0_0x12
/* 0x0013DD8C 0x801AD98C 0x10850456 */ .word 0x10850456 # beq $a0, $a1, 0x801AEAE8
/* 0x0013DD90 0x801AD990 0x391730D5 */ .word 0x391730D5 # xori $s7, $t0, 0x30D5
/* 0x0013DD94 0x801AD994 0x28D1188D */ .word 0x28D1188D # slti $s1, $a2, 0x188D
/* 0x0013DD98 0x801AD998 0x10490847 */ .word 0x10490847 # beq $v0, $t1, 0x801AFAB8
/* 0x0013DD9C 0x801AD99C 0x8427CE75 */ .word 0x8427CE75 # lh $a3, -0x318B($at)
/* 0x0013DDA0 0x801AD9A0 0xDEF9EF7D */ .word 0xDEF9EF7D # ld $t9, -0x1083($s7)
/* 0x0013DDA4 0x801AD9A4 0x4A9D84AD */ .word 0x4A9D84AD # op_0x12
/* 0x0013DDA8 0x801AD9A8 0x8CEFADF3 */ .word 0x8CEFADF3 # lw $t7, -0x520D($a3)
/* 0x0013DDAC 0x801AD9AC 0xCEB707C0 */ .word 0xCEB707C0 # op_0x33
/* 0x0013DDB0 0x801AD9B0 0x1083FFFF */ .word 0x1083FFFF # beq $a0, $v1, 0x801AD9B0
