/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005C1D0..0x0005C208 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf split from over-merged parent file 43: fresh entry (lui $v1,0x8019 / lbu 0x6AEC) after prior jr+delay+nop. Bit-toggle on global 0x6AEC with tail j 0x80186300. Ends jr $ra at 0x5C200; delay slot at 0x5C204 is final word before slice end 0x5C208. */
func_0005c1d0:
/* 0x0005C1D0 0x800CBDD0 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x0005C1D4 0x800CBDD4 0x90636AEC */ .word 0x90636AEC # lbu $v1, 0x6AEC($v1)
/* 0x0005C1D8 0x800CBDD8 0x30620008 */ .word 0x30620008 # andi $v0, $v1, 0x0008
/* 0x0005C1DC 0x800CBDDC 0x10400004 */ .word 0x10400004 # beq $v0, $zero, 0x800CBDF0
/* 0x0005C1E0 0x800CBDE0 0x306200DF */ .word 0x306200DF # andi $v0, $v1, 0x00DF
/* 0x0005C1E4 0x800CBDE4 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0005C1E8 0x800CBDE8 0x080618C0 */ .word 0x080618C0 # j 0x80186300
/* 0x0005C1EC 0x800CBDEC 0x2442FE44 */ .word 0x2442FE44 # addiu $v0, $v0, -0x1BC
/* 0x0005C1F0 0x800CBDF0 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0005C1F4 0x800CBDF4 0xA0226AEC */ .word 0xA0226AEC # sb $v0, 0x6AEC($at)
/* 0x0005C1F8 0x800CBDF8 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0005C1FC 0x800CBDFC 0x2442FE30 */ .word 0x2442FE30 # addiu $v0, $v0, -0x1D0
/* 0x0005C200 0x800CBE00 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005C204 0x800CBE04 0x00000000 */ .word 0x00000000 # nop
