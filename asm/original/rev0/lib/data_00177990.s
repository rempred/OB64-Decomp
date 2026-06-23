/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00177990..0x001779A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single isolated word 0x800E91D0 at 0x177990 flanked by zero words (0x177994/0x177998/0x17799C = 0x00000000). A lone 0x800E-band RAM address (not the 0x8021 table below); kept as data_ since it is a one-off and surrounded by zero pad, not a multi-entry table. (swarm-label: data_stray_pointer_0x800E). */
/* 0x00177990 0x801E7590 0x800E91D0 */ .word 0x800E91D0 # lb $t6, -0x6E30($zero)
/* 0x00177994 0x801E7594 0x00000000 */ .word 0x00000000 # nop
/* 0x00177998 0x801E7598 0x00000000 */ .word 0x00000000 # nop
/* 0x0017799C 0x801E759C 0x00000000 */ .word 0x00000000 # nop
