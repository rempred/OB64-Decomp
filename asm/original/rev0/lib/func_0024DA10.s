/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024DA10..0x0024DA50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x28; small wrapper, jal 0x801F7344 then jal 0x801F85C0 with masked args. jr $ra @0x0024DA48 + delay @0x0024DA4C = slice end. */
/* function boundary candidate: func_0024DA10, size=64, kind=prologue */
func_0024DA10:
/* 0x0024DA10 0x802BD610 0x27BDFFD8 */ .word 0x27BDFFD8 # addiu $sp, $sp, -0x28
/* 0x0024DA14 0x802BD614 0xAFB00020 */ .word 0xAFB00020 # sw $s0, 0x20($sp)
/* 0x0024DA18 0x802BD618 0x00A08021 */ .word 0x00A08021 # move $s0, $a1
/* 0x0024DA1C 0x802BD61C 0xAFBF0024 */ .word 0xAFBF0024 # sw $ra, 0x24($sp)
/* 0x0024DA20 0x802BD620 0x92060002 */ .word 0x92060002 # lbu $a2, 0x2($s0)
/* 0x0024DA24 0x802BD624 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0024DA28 0x802BD628 0x27A50010 */ .word 0x27A50010 # addiu $a1, $sp, 0x10
/* 0x0024DA2C 0x802BD62C 0x0C07DCD1 */ .word 0x0C07DCD1 # jal 0x801F7344
/* 0x0024DA30 0x802BD630 0x30C600F0 */ .word 0x30C600F0 # andi $a2, $a2, 0x00F0
/* 0x0024DA34 0x802BD634 0x27A40010 */ .word 0x27A40010 # addiu $a0, $sp, 0x10
/* 0x0024DA38 0x802BD638 0x0C07E170 */ .word 0x0C07E170 # jal 0x801F85C0
/* 0x0024DA3C 0x802BD63C 0x02002821 */ .word 0x02002821 # move $a1, $s0
/* 0x0024DA40 0x802BD640 0x8FBF0024 */ .word 0x8FBF0024 # lw $ra, 0x24($sp)
/* 0x0024DA44 0x802BD644 0x8FB00020 */ .word 0x8FB00020 # lw $s0, 0x20($sp)
/* 0x0024DA48 0x802BD648 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024DA4C 0x802BD64C 0x27BD0028 */ .word 0x27BD0028 # addiu $sp, $sp, 0x28
