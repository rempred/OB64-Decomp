/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x0022653C..0x00226580 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf recovered from plan over-merge; reads global 0x801D0714 list head, walks 0x801D081C array. Ends jr $ra @00226578 + delay (move $v0,$v1). */
/* 0x0022653C 0x8029613C 0x3C04801D */ .word 0x3C04801D # lui $a0, 0x801D
/* 0x00226540 0x80296140 0x94840714 */ .word 0x94840714 # lhu $a0, 0x714($a0)
/* 0x00226544 0x80296144 0x3402FFFF */ .word 0x3402FFFF # ori $v0, $zero, 0xFFFF
/* 0x00226548 0x80296148 0x1082000B */ .word 0x1082000B # beq $a0, $v0, 0x80296178
/* 0x0022654C 0x8029614C 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00226550 0x80296150 0x00041140 */ .word 0x00041140 # sll $v0, $a0, 5
/* 0x00226554 0x80296154 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x00226558 0x80296158 0x8C63081C */ .word 0x8C63081C # lw $v1, 0x81C($v1)
/* 0x0022655C 0x8029615C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00226560 0x80296160 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00226564 0x80296164 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00226568 0x80296168 0x94620000 */ .word 0x94620000 # lhu $v0, 0x0($v1)
/* 0x0022656C 0x8029616C 0xAC600008 */ .word 0xAC600008 # sw $zero, 0x8($v1)
/* 0x00226570 0x80296170 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x00226574 0x80296174 0xA4220714 */ .word 0xA4220714 # sh $v0, 0x714($at)
/* 0x00226578 0x80296178 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0022657C 0x8029617C 0x00601021 */ .word 0x00601021 # move $v0, $v1
