/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00171E58..0x00171E78 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Mixed float64/float32 constant pool. Evidence: 0x404CA666 0x66666666 (float64 =57.3), 0x40568000 0x00000000 (float64 =90.0), 0x40240000 0x00000000 (float64 =10.0), then float64 0x3F91D14E 0x3BCD35A8 (=~0.01745, radians-per-degree). All exponent-band 0x40xx/0x3Fxx with 0x6666/zero mantissas -> const pool, not code. (swarm-label: float_00171E58_const_pool). */
/* 0x00171E58 0x801E1A58 0x404CA666 */ .word 0x404CA666 # cop0_0x02
/* 0x00171E5C 0x801E1A5C 0x66666666 */ .word 0x66666666 # daddiu $a2, $s3, 0x6666
/* 0x00171E60 0x801E1A60 0x40568000 */ .word 0x40568000 # cop0_0x02
/* 0x00171E64 0x801E1A64 0x00000000 */ .word 0x00000000 # nop
/* 0x00171E68 0x801E1A68 0x40240000 */ .word 0x40240000 # cop0_0x01
/* 0x00171E6C 0x801E1A6C 0x00000000 */ .word 0x00000000 # nop
/* 0x00171E70 0x801E1A70 0x3F91D14E */ .word 0x3F91D14E # lui $s1, 0xD14E
/* 0x00171E74 0x801E1A74 0x3BCD35A8 */ .word 0x3BCD35A8 # xori $t5, $s8, 0x35A8
