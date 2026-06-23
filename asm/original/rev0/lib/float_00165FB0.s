/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00165FB0..0x00165FC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small const block: 0x20200000 ('  \0\0', two ASCII spaces then NUL pad) at 0x165FB0, 0x00000000 at 0x165FB4, then IEEE-754 single 0x40448000 (= 3.0703125) at 0x165FB8, 0x00000000 at 0x165FBC. Mixed space-padding word + float constant. Raw words: 0x20200000, 0x00000000, 0x40448000, 0x00000000.. */
/* 0x00165FB0 0x801D5BB0 0x20200000 */ .word 0x20200000 # addi $zero, $at, 0x0
/* 0x00165FB4 0x801D5BB4 0x00000000 */ .word 0x00000000 # nop
/* 0x00165FB8 0x801D5BB8 0x40448000 */ .word 0x40448000 # cop0_0x02
/* 0x00165FBC 0x801D5BBC 0x00000000 */ .word 0x00000000 # nop
