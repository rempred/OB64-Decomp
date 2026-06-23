/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x002677D0..0x00267828 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed leaf (addiu $sp,-8). Loop over array, adds $a2 to fields at +4/+8/+C. Ends jr $ra @0x267820 + delay (addiu $sp); 0x267824 nop attaches as alignment. */
/* function boundary candidate: func_002677D0, size=88, kind=prologue */
func_002677D0:
/* 0x002677D0 0x802D73D0 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x002677D4 0x802D73D4 0x00804821 */ .word 0x00804821 # move $t1, $a0
/* 0x002677D8 0x802D73D8 0x19200010 */ .word 0x19200010 # blez $t1, 0x802D741C
/* 0x002677DC 0x802D73DC 0x00004021 */ .word 0x00004021 # move $t0, $zero
/* 0x002677E0 0x802D73E0 0x8CA70000 */ .word 0x8CA70000 # lw $a3, 0x0($a1)
/* 0x002677E4 0x802D73E4 0x10E0000A */ .word 0x10E0000A # beq $a3, $zero, 0x802D7410
/* 0x002677E8 0x802D73E8 0x25080001 */ .word 0x25080001 # addiu $t0, $t0, 0x1
/* 0x002677EC 0x802D73EC 0x8CE20004 */ .word 0x8CE20004 # lw $v0, 0x4($a3)
/* 0x002677F0 0x802D73F0 0x8CE30008 */ .word 0x8CE30008 # lw $v1, 0x8($a3)
/* 0x002677F4 0x802D73F4 0x8CE4000C */ .word 0x8CE4000C # lw $a0, 0xC($a3)
/* 0x002677F8 0x802D73F8 0x00461021 */ .word 0x00461021 # addu $v0, $v0, $a2
/* 0x002677FC 0x802D73FC 0x00661821 */ .word 0x00661821 # addu $v1, $v1, $a2
/* 0x00267800 0x802D7400 0x00862021 */ .word 0x00862021 # addu $a0, $a0, $a2
/* 0x00267804 0x802D7404 0xACE20004 */ .word 0xACE20004 # sw $v0, 0x4($a3)
/* 0x00267808 0x802D7408 0xACE30008 */ .word 0xACE30008 # sw $v1, 0x8($a3)
/* 0x0026780C 0x802D740C 0xACE4000C */ .word 0xACE4000C # sw $a0, 0xC($a3)
/* 0x00267810 0x802D7410 0x0109102A */ .word 0x0109102A # slt $v0, $t0, $t1
/* 0x00267814 0x802D7414 0x1440FFF2 */ .word 0x1440FFF2 # bne $v0, $zero, 0x802D73E0
/* 0x00267818 0x802D7418 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x0026781C 0x802D741C 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x00267820 0x802D7420 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00267824 0x802D7424 0x00000000 */ .word 0x00000000 # nop
