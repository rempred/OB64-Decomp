/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025C8A4..0x0025C8D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small framed stub (sp-0x18): stores $a0 to 0x80220F68, calls 0x8020DF00. jr$ra at 0x0025C8C8 + delay 0x0025C8CC. */
/* function boundary candidate: func_0025C8A4, size=44, kind=prologue */
func_0025C8A4:
/* 0x0025C8A4 0x802CC4A4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0025C8A8 0x802CC4A8 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0025C8AC 0x802CC4AC 0xAC240F68 */ .word 0xAC240F68 # sw $a0, 0xF68($at)
/* 0x0025C8B0 0x802CC4B0 0x3C048020 */ .word 0x3C048020 # lui $a0, 0x8020
/* 0x0025C8B4 0x802CC4B4 0x24847AE4 */ .word 0x24847AE4 # addiu $a0, $a0, 0x7AE4
/* 0x0025C8B8 0x802CC4B8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0025C8BC 0x802CC4BC 0x0C0837C0 */ .word 0x0C0837C0 # jal 0x8020DF00
/* 0x0025C8C0 0x802CC4C0 0x00000000 */ .word 0x00000000 # nop
/* 0x0025C8C4 0x802CC4C4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0025C8C8 0x802CC4C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025C8CC 0x802CC4CC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
