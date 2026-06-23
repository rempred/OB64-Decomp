/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024B3C4..0x0024B410 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward into prologue at 0x0024B3CC. Leading lui $a0,0x801D / lw $a0,0x7D40($a0) @0x0024B3C4-0x0024B3C8 loads $a0 = *(0x801D7D40), which is read by the body before being written (first jal 0x800712C4 @0x0024B3D4 has a nop delay slot, so $a0 is the live argument) -> true entry is the preamble. Frame-0x18 cleanup: jal 0x800712C4 on 0x801D7D40/7D44/7D48, sb *(0x801D7D4C) to 0x80187031. Ends jr$ra@0x0024B408 + delay addiu$sp,0x18@0x0024B40C at exactly 0x0024B410 (slice end; data island follows). */
func_0024B3C4:
/* 0x0024B3C4 0x802BAFC4 0x3C04801D */ .word 0x3C04801D # lui $a0, 0x801D
/* 0x0024B3C8 0x802BAFC8 0x8C847D40 */ .word 0x8C847D40 # lw $a0, 0x7D40($a0)

/* function boundary candidate: func_0024B3CC, size=68, kind=prologue */
func_0024B3CC:
/* 0x0024B3CC 0x802BAFCC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0024B3D0 0x802BAFD0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0024B3D4 0x802BAFD4 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0024B3D8 0x802BAFD8 0x00000000 */ .word 0x00000000 # nop
/* 0x0024B3DC 0x802BAFDC 0x3C04801D */ .word 0x3C04801D # lui $a0, 0x801D
/* 0x0024B3E0 0x802BAFE0 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0024B3E4 0x802BAFE4 0x8C847D44 */ .word 0x8C847D44 # lw $a0, 0x7D44($a0)
/* 0x0024B3E8 0x802BAFE8 0x3C04801D */ .word 0x3C04801D # lui $a0, 0x801D
/* 0x0024B3EC 0x802BAFEC 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0024B3F0 0x802BAFF0 0x8C847D48 */ .word 0x8C847D48 # lw $a0, 0x7D48($a0)
/* 0x0024B3F4 0x802BAFF4 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0024B3F8 0x802BAFF8 0x8C427D4C */ .word 0x8C427D4C # lw $v0, 0x7D4C($v0)
/* 0x0024B3FC 0x802BAFFC 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x0024B400 0x802BB000 0xA0227031 */ .word 0xA0227031 # sb $v0, 0x7031($at)
/* 0x0024B404 0x802BB004 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0024B408 0x802BB008 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024B40C 0x802BB00C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
