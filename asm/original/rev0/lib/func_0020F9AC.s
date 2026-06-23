/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020F9AC..0x0020FA04 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged from parent func_0020F8DC: frameless leaf (no $sp adjust), lui $v0,0x8019/lbu loop over table at 0x801971F0, internal j 0x801CC56C, ends jr$ra@0x0020F9FC + delay 0x0020FA00 (nop). */
/* 0x0020F9AC 0x8027F5AC 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0020F9B0 0x8027F5B0 0x904276DC */ .word 0x904276DC # lbu $v0, 0x76DC($v0)
/* 0x0020F9B4 0x8027F5B4 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0020F9B8 0x8027F5B8 0x00021840 */ .word 0x00021840 # sll $v1, $v0, 1
/* 0x0020F9BC 0x8027F5BC 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x0020F9C0 0x8027F5C0 0x000318C0 */ .word 0x000318C0 # sll $v1, $v1, 3
/* 0x0020F9C4 0x8027F5C4 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x0020F9C8 0x8027F5C8 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0020F9CC 0x8027F5CC 0x244271F0 */ .word 0x244271F0 # addiu $v0, $v0, 0x71F0
/* 0x0020F9D0 0x8027F5D0 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x0020F9D4 0x8027F5D4 0x00651021 */ .word 0x00651021 # addu $v0, $v1, $a1
/* 0x0020F9D8 0x8027F5D8 0x9042000D */ .word 0x9042000D # lbu $v0, 0xD($v0)
/* 0x0020F9DC 0x8027F5DC 0x54440003 */ .word 0x54440003 # bnel $v0, $a0, 0x8027F5EC
/* 0x0020F9E0 0x8027F5E0 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0020F9E4 0x8027F5E4 0x0807315B */ .word 0x0807315B # j 0x801CC56C
/* 0x0020F9E8 0x8027F5E8 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0020F9EC 0x8027F5EC 0x28A2000A */ .word 0x28A2000A # slti $v0, $a1, 0xA
/* 0x0020F9F0 0x8027F5F0 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x8027F5D8
/* 0x0020F9F4 0x8027F5F4 0x00651021 */ .word 0x00651021 # addu $v0, $v1, $a1
/* 0x0020F9F8 0x8027F5F8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020F9FC 0x8027F5FC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020FA00 0x8027F600 0x00000000 */ .word 0x00000000 # nop
