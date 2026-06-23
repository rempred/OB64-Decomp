/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101A40..0x00101A94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Ascending RAM pointers in the 0x801AD8xx..0x801ADExx band, e.g. 0x801AD878, 0x801AD8A4, 0x801AD8CC, ... 0x801ADE00. All high words 0x801A; values monotonically increasing -> word-aligned RAM pointer table (RAM column is a wrong linear map; words are data pointers, not code). [name-token: table_ram_ptrs_801AD8]. */
/* 0x00101A40 0x80171640 0x801AD878 */ .word 0x801AD878 # lb $k0, -0x2788($zero)
/* 0x00101A44 0x80171644 0x801AD8A4 */ .word 0x801AD8A4 # lb $k0, -0x275C($zero)
/* 0x00101A48 0x80171648 0x801AD8CC */ .word 0x801AD8CC # lb $k0, -0x2734($zero)
/* 0x00101A4C 0x8017164C 0x801AD9A8 */ .word 0x801AD9A8 # lb $k0, -0x2658($zero)
/* 0x00101A50 0x80171650 0x801AD9E4 */ .word 0x801AD9E4 # lb $k0, -0x261C($zero)
/* 0x00101A54 0x80171654 0x801ADA40 */ .word 0x801ADA40 # lb $k0, -0x25C0($zero)
/* 0x00101A58 0x80171658 0x801ADA9C */ .word 0x801ADA9C # lb $k0, -0x2564($zero)
/* 0x00101A5C 0x8017165C 0x801ADAE8 */ .word 0x801ADAE8 # lb $k0, -0x2518($zero)
/* 0x00101A60 0x80171660 0x801ADB30 */ .word 0x801ADB30 # lb $k0, -0x24D0($zero)
/* 0x00101A64 0x80171664 0x801ADB5C */ .word 0x801ADB5C # lb $k0, -0x24A4($zero)
/* 0x00101A68 0x80171668 0x801ADB94 */ .word 0x801ADB94 # lb $k0, -0x246C($zero)
/* 0x00101A6C 0x8017166C 0x801ADC14 */ .word 0x801ADC14 # lb $k0, -0x23EC($zero)
/* 0x00101A70 0x80171670 0x801ADCD4 */ .word 0x801ADCD4 # lb $k0, -0x232C($zero)
/* 0x00101A74 0x80171674 0x801ADCF4 */ .word 0x801ADCF4 # lb $k0, -0x230C($zero)
/* 0x00101A78 0x80171678 0x801ADD0C */ .word 0x801ADD0C # lb $k0, -0x22F4($zero)
/* 0x00101A7C 0x8017167C 0x801ADD3C */ .word 0x801ADD3C # lb $k0, -0x22C4($zero)
/* 0x00101A80 0x80171680 0x801ADD5C */ .word 0x801ADD5C # lb $k0, -0x22A4($zero)
/* 0x00101A84 0x80171684 0x801ADD74 */ .word 0x801ADD74 # lb $k0, -0x228C($zero)
/* 0x00101A88 0x80171688 0x801ADD88 */ .word 0x801ADD88 # lb $k0, -0x2278($zero)
/* 0x00101A8C 0x8017168C 0x801ADDC4 */ .word 0x801ADDC4 # lb $k0, -0x223C($zero)
/* 0x00101A90 0x80171690 0x801ADE00 */ .word 0x801ADE00 # lb $k0, -0x2200($zero)
