/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x002623E0..0x0026241C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed leaf (frame 0x18) with jalr $v0 callback (internal). jr$ra@0x262414 + delay 0x262418. */
/* function boundary candidate: func_002623E0, size=100, kind=prologue */
func_002623E0:
/* 0x002623E0 0x802D1FE0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002623E4 0x802D1FE4 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x002623E8 0x802D1FE8 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x002623EC 0x802D1FEC 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x002623F0 0x802D1FF0 0x8E020004 */ .word 0x8E020004 # lw $v0, 0x4($s0)
/* 0x002623F4 0x802D1FF4 0x24040006 */ .word 0x24040006 # addiu $a0, $zero, 0x6
/* 0x002623F8 0x802D1FF8 0x0040F809 */ .word 0x0040F809 # jalr $v0
/* 0x002623FC 0x802D1FFC 0x02002821 */ .word 0x02002821 # move $a1, $s0
/* 0x00262400 0x802D2000 0x8E030010 */ .word 0x8E030010 # lw $v1, 0x10($s0)
/* 0x00262404 0x802D2004 0x0062182A */ .word 0x0062182A # slt $v1, $v1, $v0
/* 0x00262408 0x802D2008 0x38620001 */ .word 0x38620001 # xori $v0, $v1, 0x0001
/* 0x0026240C 0x802D200C 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00262410 0x802D2010 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00262414 0x802D2014 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262418 0x802D2018 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
