/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x001002F8..0x00100328 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF recovered. 0x801B3E20-> +0x2E4 counter clamp at 0x78; j 0x801B32E0 tail-jump internal; jr $ra/move $v0,$a1 at 0x00100320-0x00100324. */
/* 0x001002F8 0x8016FEF8 0x3C04801B */ .word 0x3C04801B # lui $a0, 0x801B
/* 0x001002FC 0x8016FEFC 0x8C843E20 */ .word 0x8C843E20 # lw $a0, 0x3E20($a0)
/* 0x00100300 0x8016FF00 0x8C8302E4 */ .word 0x8C8302E4 # lw $v1, 0x2E4($a0)
/* 0x00100304 0x8016FF04 0x28620078 */ .word 0x28620078 # slti $v0, $v1, 0x78
/* 0x00100308 0x8016FF08 0x10400004 */ .word 0x10400004 # beq $v0, $zero, 0x8016FF1C
/* 0x0010030C 0x8016FF0C 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00100310 0x8016FF10 0x24620002 */ .word 0x24620002 # addiu $v0, $v1, 0x2
/* 0x00100314 0x8016FF14 0x0806CCB8 */ .word 0x0806CCB8 # j 0x801B32E0
/* 0x00100318 0x8016FF18 0xAC8202E4 */ .word 0xAC8202E4 # sw $v0, 0x2E4($a0)
/* 0x0010031C 0x8016FF1C 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x00100320 0x8016FF20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00100324 0x8016FF24 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
