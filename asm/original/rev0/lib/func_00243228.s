/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00243228..0x00243274 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no prologue, no addiu $sp) recovered from plan over-merge. Loads 0x801F0550, reads/increments byte at 0x7E with two compares (==1 ->4, ==4 ->5). Self-contained: own jr $ra at 0x0024326C + delay nop 0x00243270. Not a preamble for func_00243274 (which reads $a0 arg). */
/* 0x00243228 0x802B2E28 0x3C05801F */ .word 0x3C05801F # lui $a1, 0x801F
/* 0x0024322C 0x802B2E2C 0x8CA50550 */ .word 0x8CA50550 # lw $a1, 0x550($a1)
/* 0x00243230 0x802B2E30 0x90A4007E */ .word 0x90A4007E # lbu $a0, 0x7E($a1)
/* 0x00243234 0x802B2E34 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00243238 0x802B2E38 0x308300FF */ .word 0x308300FF # andi $v1, $a0, 0x00FF
/* 0x0024323C 0x802B2E3C 0x14620008 */ .word 0x14620008 # bne $v1, $v0, 0x802B2E60
/* 0x00243240 0x802B2E40 0x24020004 */ .word 0x24020004 # addiu $v0, $zero, 0x4
/* 0x00243244 0x802B2E44 0x24820001 */ .word 0x24820001 # addiu $v0, $a0, 0x1
/* 0x00243248 0x802B2E48 0xA0A2007E */ .word 0xA0A2007E # sb $v0, 0x7E($a1)
/* 0x0024324C 0x802B2E4C 0x3C05801F */ .word 0x3C05801F # lui $a1, 0x801F
/* 0x00243250 0x802B2E50 0x8CA50550 */ .word 0x8CA50550 # lw $a1, 0x550($a1)
/* 0x00243254 0x802B2E54 0x90A4007E */ .word 0x90A4007E # lbu $a0, 0x7E($a1)
/* 0x00243258 0x802B2E58 0x24020004 */ .word 0x24020004 # addiu $v0, $zero, 0x4
/* 0x0024325C 0x802B2E5C 0x308300FF */ .word 0x308300FF # andi $v1, $a0, 0x00FF
/* 0x00243260 0x802B2E60 0x14620002 */ .word 0x14620002 # bne $v1, $v0, 0x802B2E6C
/* 0x00243264 0x802B2E64 0x24820001 */ .word 0x24820001 # addiu $v0, $a0, 0x1
/* 0x00243268 0x802B2E68 0xA0A2007E */ .word 0xA0A2007E # sb $v0, 0x7E($a1)
/* 0x0024326C 0x802B2E6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00243270 0x802B2E70 0x00000000 */ .word 0x00000000 # nop
