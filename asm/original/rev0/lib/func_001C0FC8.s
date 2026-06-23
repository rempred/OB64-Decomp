/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001C0FC8..0x001C1000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler head: this function begins here and continues into the next 64 KiB chunk. OUTGOING FUNCTION STRADDLER-HEAD. Prologue addiu $sp,-0x18 @0x1C0FC8 (sw $s0,0x10/sw $ra,0x14). Body reads lbu 0xF($s0), or with $a3, jal 0x8016FBE0, sets sh 0x46($s0)=2. NO jr$ra in [0x1C0FC8,0x1C1000) — last word @0x1C0FFC is lhu $a0,0x46($s0); function CONTINUES into chunk 28. Previous fn func_001C0F10 already returned via jr$ra@0x1C0FC0. */
func_001C0FC8:
/* function boundary candidate: func_001C0FC8, size=92, kind=prologue */
func_001C0FC8:
/* 0x001C0FC8 0x80230BC8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001C0FCC 0x80230BCC 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x001C0FD0 0x80230BD0 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x001C0FD4 0x80230BD4 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x001C0FD8 0x80230BD8 0x9202000F */ .word 0x9202000F # lbu $v0, 0xF($s0)
/* 0x001C0FDC 0x80230BDC 0x30A400FF */ .word 0x30A400FF # andi $a0, $a1, 0x00FF
/* 0x001C0FE0 0x80230BE0 0x30C500FF */ .word 0x30C500FF # andi $a1, $a2, 0x00FF
/* 0x001C0FE4 0x80230BE4 0x26060050 */ .word 0x26060050 # addiu $a2, $s0, 0x50
/* 0x001C0FE8 0x80230BE8 0x00471025 */ .word 0x00471025 # or $v0, $v0, $a3
/* 0x001C0FEC 0x80230BEC 0x0C05BEF8 */ .word 0x0C05BEF8 # jal 0x8016FBE0
/* 0x001C0FF0 0x80230BF0 0xA202000F */ .word 0xA202000F # sb $v0, 0xF($s0)
/* 0x001C0FF4 0x80230BF4 0x24030002 */ .word 0x24030002 # addiu $v1, $zero, 0x2
/* 0x001C0FF8 0x80230BF8 0xA6030046 */ .word 0xA6030046 # sh $v1, 0x46($s0)
/* 0x001C0FFC 0x80230BFC 0x96040046 */ .word 0x96040046 # lhu $a0, 0x46($s0)
