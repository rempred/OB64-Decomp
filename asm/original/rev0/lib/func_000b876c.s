/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B876C..0x000B8794 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf un-merged from func_000b86f8 (adversarial under-split fix); reads $a2/$a0/$a1 read-before-write via lui/lw 0x80196AF8; jr $ra@0xB878C */
/* 0x000B876C 0x8012836C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000B8770 0x80128370 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000B8774 0x80128374 0xA0460180 */ .word 0xA0460180 # sb $a2, 0x180($v0)
/* 0x000B8778 0x80128378 0x30C600FF */ .word 0x30C600FF # andi $a2, $a2, 0x00FF
/* 0x000B877C 0x8012837C 0x10C00003 */ .word 0x10C00003 # beq $a2, $zero, 0x8012838C
/* 0x000B8780 0x80128380 0x00000000 */ .word 0x00000000 # nop
/* 0x000B8784 0x80128384 0xA444017C */ .word 0xA444017C # sh $a0, 0x17C($v0)
/* 0x000B8788 0x80128388 0xA445017E */ .word 0xA445017E # sh $a1, 0x17E($v0)
/* 0x000B878C 0x8012838C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B8790 0x80128390 0x00000000 */ .word 0x00000000 # nop
