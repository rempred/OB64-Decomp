/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x000783F8..0x00078410 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): rodata string: 'Reset Control Deck.' (52657365 7420436F 6E74726F 6C204465 636B2E00) followed by zero padding to 0x78410.. */
/* 0x000783F8 0x800E7FF8 0x52657365 */ .word 0x52657365 # beql $s3, $a1, 0x80104D90
/* 0x000783FC 0x800E7FFC 0x7420436F */ .word 0x7420436F # op_0x1D
/* 0x00078400 0x800E8000 0x6E74726F */ .word 0x6E74726F # ldr $s4, 0x726F($s3)
/* 0x00078404 0x800E8004 0x6C204465 */ .word 0x6C204465 # ldr $zero, 0x4465($at)
/* 0x00078408 0x800E8008 0x636B2E00 */ .word 0x636B2E00 # daddi $t3, $k1, 0x2E00
/* 0x0007840C 0x800E800C 0x00000000 */ .word 0x00000000 # nop
