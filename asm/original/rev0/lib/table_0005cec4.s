/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005CEC4..0x0005CEE4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Pointer table, 8 words, all RAM pointers (0x80xxxxxx): 0x80186F70, 0x80186F80, 0x80186F94, 0x80186FA8 then 0x8016DF88, 0x8016DFDC, 0x8016E030, 0x8016E084. First group is a tight cluster (likely 4 AI-behaviour string ptrs into the prior pool), second group is an evenly-strided (+0x54) ptr set.. */
/* 0x0005CEC4 0x800CCAC4 0x80186F70 */ .word 0x80186F70 # lb $t8, 0x6F70($zero)
/* 0x0005CEC8 0x800CCAC8 0x80186F80 */ .word 0x80186F80 # lb $t8, 0x6F80($zero)
/* 0x0005CECC 0x800CCACC 0x80186F94 */ .word 0x80186F94 # lb $t8, 0x6F94($zero)
/* 0x0005CED0 0x800CCAD0 0x80186FA8 */ .word 0x80186FA8 # lb $t8, 0x6FA8($zero)
/* 0x0005CED4 0x800CCAD4 0x8016DF88 */ .word 0x8016DF88 # lb $s6, -0x2078($zero)
/* 0x0005CED8 0x800CCAD8 0x8016DFDC */ .word 0x8016DFDC # lb $s6, -0x2024($zero)
/* 0x0005CEDC 0x800CCADC 0x8016E030 */ .word 0x8016E030 # lb $s6, -0x1FD0($zero)
/* 0x0005CEE0 0x800CCAE0 0x8016E084 */ .word 0x8016E084 # lb $s6, -0x1F7C($zero)
