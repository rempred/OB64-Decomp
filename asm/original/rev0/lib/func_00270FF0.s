/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00270FF0..0x00271000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler head: this function begins here and continues into the next 64 KiB chunk. OUTGOING straddler-head. Prologue addiu $sp,-0x28@0x00270FF0 (no preamble). Has NO jr$ra before 0x00271000; continues into chunk 39 (returns jr$ra@0x00271068 + delay addiu$sp,0x28@0x0027106C). Range exactly [0x00270FF0,0x00271000). */
func_00270FF0:
/* function boundary candidate: func_00270FF0, size=128, kind=prologue */
func_00270FF0:
/* 0x00270FF0 0x802E0BF0 0x27BDFFD8 */ .word 0x27BDFFD8 # addiu $sp, $sp, -0x28
/* 0x00270FF4 0x802E0BF4 0xAFB10014 */ .word 0xAFB10014 # sw $s1, 0x14($sp)
/* 0x00270FF8 0x802E0BF8 0x00808821 */ .word 0x00808821 # move $s1, $a0
/* 0x00270FFC 0x802E0BFC 0xAFB20018 */ .word 0xAFB20018 # sw $s2, 0x18($sp)
