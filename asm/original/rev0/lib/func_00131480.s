/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x00131480..0x001314D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Split from parent func_00131388 over-merge. Frameless leaf reading a0/a1 args; scans 0x801971FD table. Internal j 0x801DCD88. jr $ra 0x1314C8 + delay 0x1314CC. */
/* 0x00131480 0x801A1080 0x90820004 */ .word 0x90820004 # lbu $v0, 0x4($a0)
/* 0x00131484 0x801A1084 0x30A500FF */ .word 0x30A500FF # andi $a1, $a1, 0x00FF
/* 0x00131488 0x801A1088 0x00021840 */ .word 0x00021840 # sll $v1, $v0, 1
/* 0x0013148C 0x801A108C 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00131490 0x801A1090 0x000318C0 */ .word 0x000318C0 # sll $v1, $v1, 3
/* 0x00131494 0x801A1094 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00131498 0x801A1098 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0013149C 0x801A109C 0x244271FD */ .word 0x244271FD # addiu $v0, $v0, 0x71FD
/* 0x001314A0 0x801A10A0 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x001314A4 0x801A10A4 0x2464000A */ .word 0x2464000A # addiu $a0, $v1, 0xA
/* 0x001314A8 0x801A10A8 0x90620000 */ .word 0x90620000 # lbu $v0, 0x0($v1)
/* 0x001314AC 0x801A10AC 0x54450003 */ .word 0x54450003 # bnel $v0, $a1, 0x801A10BC
/* 0x001314B0 0x801A10B0 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x001314B4 0x801A10B4 0x08077362 */ .word 0x08077362 # j 0x801DCD88
/* 0x001314B8 0x801A10B8 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x001314BC 0x801A10BC 0x0064102A */ .word 0x0064102A # slt $v0, $v1, $a0
/* 0x001314C0 0x801A10C0 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x801A10A8
/* 0x001314C4 0x801A10C4 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x001314C8 0x801A10C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001314CC 0x801A10CC 0x00000000 */ .word 0x00000000 # nop
