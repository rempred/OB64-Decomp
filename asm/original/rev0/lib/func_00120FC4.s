/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00111000_00121000.s
 * z64 range: 0x00120FC4..0x00121000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler head: this function begins here and continues into the next 64 KiB chunk. Outgoing function straddler-head: prologue addiu $sp,-0x50 at 0x120FC4 saving s0/s1/f20-f30 and lwc1-loading stack args. No jr $ra in [0x120FC4,0x121000); last slice word is sdc1 $f20,0x20($sp) at 0x120FFC, still prologue body. Function continues past 0x121000 into chunk 18 (parent end 0x1211F8). */
/* function boundary candidate: func_00120FC4, size=564, kind=prologue */
func_00120FC4:
/* 0x00120FC4 0x80190BC4 0x27BDFFB0 */ .word 0x27BDFFB0 # addiu $sp, $sp, -0x50
/* 0x00120FC8 0x80190BC8 0xF7BA0038 */ .word 0xF7BA0038 # sdc1 $f26, 0x38($sp)
/* 0x00120FCC 0x80190BCC 0xC7BA0060 */ .word 0xC7BA0060 # lwc1 $f26, 0x60($sp)
/* 0x00120FD0 0x80190BD0 0xF7B80030 */ .word 0xF7B80030 # sdc1 $f24, 0x30($sp)
/* 0x00120FD4 0x80190BD4 0xC7B80068 */ .word 0xC7B80068 # lwc1 $f24, 0x68($sp)
/* 0x00120FD8 0x80190BD8 0xF7BE0048 */ .word 0xF7BE0048 # sdc1 $f30, 0x48($sp)
/* 0x00120FDC 0x80190BDC 0xC7BE006C */ .word 0xC7BE006C # lwc1 $f30, 0x6C($sp)
/* 0x00120FE0 0x80190BE0 0xF7BC0040 */ .word 0xF7BC0040 # sdc1 $f28, 0x40($sp)
/* 0x00120FE4 0x80190BE4 0xC7BC0074 */ .word 0xC7BC0074 # lwc1 $f28, 0x74($sp)
/* 0x00120FE8 0x80190BE8 0xF7B60028 */ .word 0xF7B60028 # sdc1 $f22, 0x28($sp)
/* 0x00120FEC 0x80190BEC 0x4485B000 */ .word 0x4485B000 # mtc1 $a1, $f22
/* 0x00120FF0 0x80190BF0 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00120FF4 0x80190BF4 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x00120FF8 0x80190BF8 0xAFB10014 */ .word 0xAFB10014 # sw $s1, 0x14($sp)
/* 0x00120FFC 0x80190BFC 0xF7B40020 */ .word 0xF7B40020 # sdc1 $f20, 0x20($sp)
