/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BBFB0..0x001BBFFC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed: addiu $sp,-0x18; computes ($a0*0x76) offset into 0x8023A2E8 table base; jal 0x80093380(a1=0x76); returns pointer in v0; jr $ra(0x1BBFF4)+delay addiu $sp,0x18(0x1BBFF8). */
func_001BBFB0:
/* function boundary candidate: func_001BBFB0, size=112, kind=prologue */
func_001BBFB0:
/* 0x001BBFB0 0x8022BBB0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001BBFB4 0x8022BBB4 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x001BBFB8 0x8022BBB8 0x00048100 */ .word 0x00048100 # sll $s0, $a0, 4
/* 0x001BBFBC 0x8022BBBC 0x02048023 */ .word 0x02048023 # subu $s0, $s0, $a0
/* 0x001BBFC0 0x8022BBC0 0x00108080 */ .word 0x00108080 # sll $s0, $s0, 2
/* 0x001BBFC4 0x8022BBC4 0x02048023 */ .word 0x02048023 # subu $s0, $s0, $a0
/* 0x001BBFC8 0x8022BBC8 0x00108040 */ .word 0x00108040 # sll $s0, $s0, 1
/* 0x001BBFCC 0x8022BBCC 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x001BBFD0 0x8022BBD0 0x2442A2E8 */ .word 0x2442A2E8 # addiu $v0, $v0, -0x5D18
/* 0x001BBFD4 0x8022BBD4 0x02028021 */ .word 0x02028021 # addu $s0, $s0, $v0
/* 0x001BBFD8 0x8022BBD8 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x001BBFDC 0x8022BBDC 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x001BBFE0 0x8022BBE0 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x001BBFE4 0x8022BBE4 0x24050076 */ .word 0x24050076 # addiu $a1, $zero, 0x76
/* 0x001BBFE8 0x8022BBE8 0x02001021 */ .word 0x02001021 # move $v0, $s0
/* 0x001BBFEC 0x8022BBEC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x001BBFF0 0x8022BBF0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x001BBFF4 0x8022BBF4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BBFF8 0x8022BBF8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
