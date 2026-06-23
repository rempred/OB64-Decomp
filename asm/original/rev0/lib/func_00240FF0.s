/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x00240FF0..0x00241000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler head: this function begins here and continues into the next 64 KiB chunk. Outgoing function straddler-head: prologue addiu$sp,-0x20; sw$s0; lui$s0,0x801F; lw$s0,-0x1B8($s0). No jr$ra before 0x00241000; function body continues into chunk 36. */
/* function boundary candidate: func_00240FF0, size=176, kind=prologue */
func_00240FF0:
/* 0x00240FF0 0x802B0BF0 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x00240FF4 0x802B0BF4 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00240FF8 0x802B0BF8 0x3C10801F */ .word 0x3C10801F # lui $s0, 0x801F
/* 0x00240FFC 0x802B0BFC 0x8E10FE48 */ .word 0x8E10FE48 # lw $s0, -0x1B8($s0)
