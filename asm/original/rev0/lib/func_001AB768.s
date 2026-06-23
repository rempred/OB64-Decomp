/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001AB768..0x001AB798 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x1AB768: 2-word read-before-write preamble lui $a0,0x8022 / lw $a0,-0x1C34($a0) loading the global func_001AB72C just wrote. Body prologue addiu $sp,-0x18 @0x1AB770; first jal 0x800712C4 @0x1AB778 (delay nop) reads $a0 from the preamble without redefining it first -> fold FORWARD, high confidence. Terminal jr $ra @0x1AB790 + delay @0x1AB794. Preamble-orphan: 2-word read-before-write preamble @0x1AB768 ($a0), body prologue @0x1AB770. */
func_001AB768:
/* 0x001AB768 0x8021B368 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x001AB76C 0x8021B36C 0x8C84E3CC */ .word 0x8C84E3CC # lw $a0, -0x1C34($a0)

/* function boundary candidate: func_001AB770, size=40, kind=prologue */
func_001AB770:
/* 0x001AB770 0x8021B370 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001AB774 0x8021B374 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001AB778 0x8021B378 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x001AB77C 0x8021B37C 0x00000000 */ .word 0x00000000 # nop
/* 0x001AB780 0x8021B380 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x001AB784 0x8021B384 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x001AB788 0x8021B388 0x8C84E3D0 */ .word 0x8C84E3D0 # lw $a0, -0x1C30($a0)
/* 0x001AB78C 0x8021B38C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001AB790 0x8021B390 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001AB794 0x8021B394 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
