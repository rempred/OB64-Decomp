/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BBFFC..0x001BC020 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: computes ($a0*0x76) offset into 0x8023A2E8 table base, returns pointer in v0; j-less; jr $ra(0x1BC018)+delay addu $v0,$v0,$v1(0x1BC01C). */
func_001BBFFC:
/* 0x001BBFFC 0x8022BBFC 0x00041100 */ .word 0x00041100 # sll $v0, $a0, 4
/* 0x001BC000 0x8022BC00 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x001BC004 0x8022BC04 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x001BC008 0x8022BC08 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x001BC00C 0x8022BC0C 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x001BC010 0x8022BC10 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x001BC014 0x8022BC14 0x2463A2E8 */ .word 0x2463A2E8 # addiu $v1, $v1, -0x5D18
/* 0x001BC018 0x8022BC18 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BC01C 0x8022BC1C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
