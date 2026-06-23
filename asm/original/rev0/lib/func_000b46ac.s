/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B46AC..0x000B4700 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless/leaf split at jr $ra boundary; overlay-relocated (linear RAM column is wrong map). */
func_000b46ac:
/* 0x000B46AC 0x801242AC 0x3C078019 */ .word 0x3C078019 # lui $a3, 0x8019
/* 0x000B46B0 0x801242B0 0x8CE76AF8 */ .word 0x8CE76AF8 # lw $a3, 0x6AF8($a3)
/* 0x000B46B4 0x801242B4 0x94E3012C */ .word 0x94E3012C # lhu $v1, 0x12C($a3)
/* 0x000B46B8 0x801242B8 0x3C02CCCC */ .word 0x3C02CCCC # lui $v0, 0xCCCC
/* 0x000B46BC 0x801242BC 0x3442CCCD */ .word 0x3442CCCD # ori $v0, $v0, 0xCCCD
/* 0x000B46C0 0x801242C0 0x00620019 */ .word 0x00620019 # multu $v1, $v0
/* 0x000B46C4 0x801242C4 0x00004010 */ .word 0x00004010 # mfhi $t0
/* 0x000B46C8 0x801242C8 0x000830C2 */ .word 0x000830C2 # srl $a2, $t0, 3
/* 0x000B46CC 0x801242CC 0x00061080 */ .word 0x00061080 # sll $v0, $a2, 2
/* 0x000B46D0 0x801242D0 0x00461021 */ .word 0x00461021 # addu $v0, $v0, $a2
/* 0x000B46D4 0x801242D4 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x000B46D8 0x801242D8 0x00621823 */ .word 0x00621823 # subu $v1, $v1, $v0
/* 0x000B46DC 0x801242DC 0x3063FFFF */ .word 0x3063FFFF # andi $v1, $v1, 0xFFFF
/* 0x000B46E0 0x801242E0 0x00031840 */ .word 0x00031840 # sll $v1, $v1, 1
/* 0x000B46E4 0x801242E4 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x000B46E8 0x801242E8 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000B46EC 0x801242EC 0x8442F1BE */ .word 0x8442F1BE # lh $v0, -0xE42($v0)
/* 0x000B46F0 0x801242F0 0xACE410AC */ .word 0xACE410AC # sw $a0, 0x10AC($a3)
/* 0x000B46F4 0x801242F4 0x00A22821 */ .word 0x00A22821 # addu $a1, $a1, $v0
/* 0x000B46F8 0x801242F8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B46FC 0x801242FC 0xACE510B0 */ .word 0xACE510B0 # sw $a1, 0x10B0($a3)
