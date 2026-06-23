/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x00294FAC..0x00294FEC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* addiu $sp,-0x18 prologue; small allocator/memset wrapper; ends jr $ra @0x00294FE4 + delay @0x00294FE8. */
/* function boundary candidate: func_00294FAC, size=64, kind=prologue */
func_00294FAC:
/* 0x00294FAC 0x80304BAC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00294FB0 0x80304BB0 0x24040500 */ .word 0x24040500 # addiu $a0, $zero, 0x500
/* 0x00294FB4 0x80304BB4 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00294FB8 0x80304BB8 0x0C01C3CC */ .word 0x0C01C3CC # jal 0x80070F30
/* 0x00294FBC 0x80304BBC 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00294FC0 0x80304BC0 0x00408021 */ .word 0x00408021 # move $s0, $v0
/* 0x00294FC4 0x80304BC4 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00294FC8 0x80304BC8 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x00294FCC 0x80304BCC 0x24050500 */ .word 0x24050500 # addiu $a1, $zero, 0x500
/* 0x00294FD0 0x80304BD0 0x0C08E3B1 */ .word 0x0C08E3B1 # jal 0x80238EC4
/* 0x00294FD4 0x80304BD4 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00294FD8 0x80304BD8 0x02001021 */ .word 0x02001021 # move $v0, $s0
/* 0x00294FDC 0x80304BDC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00294FE0 0x80304BE0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00294FE4 0x80304BE4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00294FE8 0x80304BE8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
