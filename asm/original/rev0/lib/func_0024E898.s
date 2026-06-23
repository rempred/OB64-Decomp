/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024E898..0x0024E8DC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x28; jal 0x801F7344 then jal 0x80218104 with FP args (lwc1 $f12/$f14). jr $ra at 0x0024E8D4 + delay at 0x0024E8D8. */
/* function boundary candidate: func_0024E898, size=68, kind=prologue */
func_0024E898:
/* 0x0024E898 0x802BE498 0x27BDFFD8 */ .word 0x27BDFFD8 # addiu $sp, $sp, -0x28
/* 0x0024E89C 0x802BE49C 0xAFB00020 */ .word 0xAFB00020 # sw $s0, 0x20($sp)
/* 0x0024E8A0 0x802BE4A0 0x00A08021 */ .word 0x00A08021 # move $s0, $a1
/* 0x0024E8A4 0x802BE4A4 0x24060020 */ .word 0x24060020 # addiu $a2, $zero, 0x20
/* 0x0024E8A8 0x802BE4A8 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0024E8AC 0x802BE4AC 0xAFBF0024 */ .word 0xAFBF0024 # sw $ra, 0x24($sp)
/* 0x0024E8B0 0x802BE4B0 0x0C07DCD1 */ .word 0x0C07DCD1 # jal 0x801F7344
/* 0x0024E8B4 0x802BE4B4 0x27A50010 */ .word 0x27A50010 # addiu $a1, $sp, 0x10
/* 0x0024E8B8 0x802BE4B8 0x8FA60018 */ .word 0x8FA60018 # lw $a2, 0x18($sp)
/* 0x0024E8BC 0x802BE4BC 0xC7AC0010 */ .word 0xC7AC0010 # lwc1 $f12, 0x10($sp)
/* 0x0024E8C0 0x802BE4C0 0xC7AE0014 */ .word 0xC7AE0014 # lwc1 $f14, 0x14($sp)
/* 0x0024E8C4 0x802BE4C4 0x0C086041 */ .word 0x0C086041 # jal 0x80218104
/* 0x0024E8C8 0x802BE4C8 0x02003821 */ .word 0x02003821 # move $a3, $s0
/* 0x0024E8CC 0x802BE4CC 0x8FBF0024 */ .word 0x8FBF0024 # lw $ra, 0x24($sp)
/* 0x0024E8D0 0x802BE4D0 0x8FB00020 */ .word 0x8FB00020 # lw $s0, 0x20($sp)
/* 0x0024E8D4 0x802BE4D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024E8D8 0x802BE4D8 0x27BD0028 */ .word 0x27BD0028 # addiu $sp, $sp, 0x28
