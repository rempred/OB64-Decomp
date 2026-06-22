/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x000784A8..0x000784EC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): rodata string pool: chapter labels 'Prologue','Chapter One','Chapter Two','Chapter Three','Final Chapter', NUL-terminated, zero-padded to word boundaries.. */
/* 0x000784A8 0x800E80A8 0x50726F6C */ .word 0x50726F6C # beql $v1, $s2, 0x80103E5C
/* 0x000784AC 0x800E80AC 0x6F677565 */ .word 0x6F677565 # ldr $a3, 0x7565($k1)
/* 0x000784B0 0x800E80B0 0x00000000 */ .word 0x00000000 # nop
/* 0x000784B4 0x800E80B4 0x43686170 */ .word 0x43686170 # cop0_0x1B
/* 0x000784B8 0x800E80B8 0x74657220 */ .word 0x74657220 # op_0x1D
/* 0x000784BC 0x800E80BC 0x4F6E6500 */ .word 0x4F6E6500 # op_0x13
/* 0x000784C0 0x800E80C0 0x43686170 */ .word 0x43686170 # cop0_0x1B
/* 0x000784C4 0x800E80C4 0x74657220 */ .word 0x74657220 # op_0x1D
/* 0x000784C8 0x800E80C8 0x54776F00 */ .word 0x54776F00 # bnel $v1, $s7, 0x80103CCC
/* 0x000784CC 0x800E80CC 0x43686170 */ .word 0x43686170 # cop0_0x1B
/* 0x000784D0 0x800E80D0 0x74657220 */ .word 0x74657220 # op_0x1D
/* 0x000784D4 0x800E80D4 0x54687265 */ .word 0x54687265 # bnel $v1, $t0, 0x80104A6C
/* 0x000784D8 0x800E80D8 0x65000000 */ .word 0x65000000 # daddiu $zero, $t0, 0x0
/* 0x000784DC 0x800E80DC 0x46696E61 */ .word 0x46696E61 # cvt.d.fmt19 $f25, $f13
/* 0x000784E0 0x800E80E0 0x6C204368 */ .word 0x6C204368 # ldr $zero, 0x4368($at)
/* 0x000784E4 0x800E80E4 0x61707465 */ .word 0x61707465 # daddi $s0, $t3, 0x7465
/* 0x000784E8 0x800E80E8 0x72000000 */ .word 0x72000000 # op_0x1C
