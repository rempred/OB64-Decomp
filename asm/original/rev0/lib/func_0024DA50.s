/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024DA50..0x0024DA90 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame -0x28. Prologue addiu $sp,-0x28; saves $s0/$ra; lbu attr, andi, jal 0x801F7344 formatter then jal 0x801F885C; jr $ra at 0x0024DA88 + delay addiu $sp,0x28 at 0x0024DA8C. Next word 0x0024DA90 is a fresh prologue. */
/* function boundary candidate: func_0024DA50, size=64, kind=prologue */
func_0024DA50:
/* 0x0024DA50 0x802BD650 0x27BDFFD8 */ .word 0x27BDFFD8 # addiu $sp, $sp, -0x28
/* 0x0024DA54 0x802BD654 0xAFB00020 */ .word 0xAFB00020 # sw $s0, 0x20($sp)
/* 0x0024DA58 0x802BD658 0x00A08021 */ .word 0x00A08021 # move $s0, $a1
/* 0x0024DA5C 0x802BD65C 0xAFBF0024 */ .word 0xAFBF0024 # sw $ra, 0x24($sp)
/* 0x0024DA60 0x802BD660 0x92060002 */ .word 0x92060002 # lbu $a2, 0x2($s0)
/* 0x0024DA64 0x802BD664 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0024DA68 0x802BD668 0x27A50010 */ .word 0x27A50010 # addiu $a1, $sp, 0x10
/* 0x0024DA6C 0x802BD66C 0x0C07DCD1 */ .word 0x0C07DCD1 # jal 0x801F7344
/* 0x0024DA70 0x802BD670 0x30C600F0 */ .word 0x30C600F0 # andi $a2, $a2, 0x00F0
/* 0x0024DA74 0x802BD674 0x27A40010 */ .word 0x27A40010 # addiu $a0, $sp, 0x10
/* 0x0024DA78 0x802BD678 0x0C07E217 */ .word 0x0C07E217 # jal 0x801F885C
/* 0x0024DA7C 0x802BD67C 0x02002821 */ .word 0x02002821 # move $a1, $s0
/* 0x0024DA80 0x802BD680 0x8FBF0024 */ .word 0x8FBF0024 # lw $ra, 0x24($sp)
/* 0x0024DA84 0x802BD684 0x8FB00020 */ .word 0x8FB00020 # lw $s0, 0x20($sp)
/* 0x0024DA88 0x802BD688 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024DA8C 0x802BD68C 0x27BD0028 */ .word 0x27BD0028 # addiu $sp, $sp, 0x28
