/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B34A0..0x000B34C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless/leaf split at jr $ra boundary; overlay-relocated (linear RAM column is wrong map). */
func_000b34a0:
/* 0x000B34A0 0x801230A0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000B34A4 0x801230A4 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000B34A8 0x801230A8 0x93A30013 */ .word 0x93A30013 # lbu $v1, 0x13($sp)
/* 0x000B34AC 0x801230AC 0xA0440092 */ .word 0xA0440092 # sb $a0, 0x92($v0)
/* 0x000B34B0 0x801230B0 0xA0450093 */ .word 0xA0450093 # sb $a1, 0x93($v0)
/* 0x000B34B4 0x801230B4 0xA0460094 */ .word 0xA0460094 # sb $a2, 0x94($v0)
/* 0x000B34B8 0x801230B8 0xA0470095 */ .word 0xA0470095 # sb $a3, 0x95($v0)
/* 0x000B34BC 0x801230BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B34C0 0x801230C0 0xA0430096 */ .word 0xA0430096 # sb $v1, 0x96($v0)
