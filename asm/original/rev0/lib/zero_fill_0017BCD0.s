/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x0017BCD0..0x0017BCF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8 pure-zero words (0x00000000) of NOP/zero padding at start of Data Island 2, immediately after code2's trailing 'jr $ra'/'addiu $sp' at 0x17BCC8-0x17BCCC. (swarm-label: zero_fill_island2_pad). */
/* 0x0017BCD0 0x801EB8D0 0x00000000 */ .word 0x00000000 # nop
/* 0x0017BCD4 0x801EB8D4 0x00000000 */ .word 0x00000000 # nop
/* 0x0017BCD8 0x801EB8D8 0x00000000 */ .word 0x00000000 # nop
/* 0x0017BCDC 0x801EB8DC 0x00000000 */ .word 0x00000000 # nop
/* 0x0017BCE0 0x801EB8E0 0x00000000 */ .word 0x00000000 # nop
/* 0x0017BCE4 0x801EB8E4 0x00000000 */ .word 0x00000000 # nop
/* 0x0017BCE8 0x801EB8E8 0x00000000 */ .word 0x00000000 # nop
/* 0x0017BCEC 0x801EB8EC 0x00000000 */ .word 0x00000000 # nop
