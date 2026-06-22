/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00042C5C..0x00042C90 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, entry lui $v1,0x8018; jr $ra at 0x42C80 + delay sb, alignment nops 0x42C88/0x42C8C appended */
func_00042c5c:
/* 0x00042C5C 0x800B285C 0x3C038018 */ .word 0x3C038018 # lui $v1, 0x8018
/* 0x00042C60 0x800B2860 0x90637020 */ .word 0x90637020 # lbu $v1, 0x7020($v1)
/* 0x00042C64 0x800B2864 0x00802821 */ .word 0x00802821 # move $a1, $a0
/* 0x00042C68 0x800B2868 0x30A200FF */ .word 0x30A200FF # andi $v0, $a1, 0x00FF
/* 0x00042C6C 0x800B286C 0x10620003 */ .word 0x10620003 # beq $v1, $v0, 0x800B287C
/* 0x00042C70 0x800B2870 0x24820001 */ .word 0x24820001 # addiu $v0, $a0, 0x1
/* 0x00042C74 0x800B2874 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x00042C78 0x800B2878 0xA0227021 */ .word 0xA0227021 # sb $v0, 0x7021($at)
/* 0x00042C7C 0x800B287C 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x00042C80 0x800B2880 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00042C84 0x800B2884 0xA0257020 */ .word 0xA0257020 # sb $a1, 0x7020($at)
/* 0x00042C88 0x800B2888 0x00000000 */ .word 0x00000000 # nop
/* 0x00042C8C 0x800B288C 0x00000000 */ .word 0x00000000 # nop
