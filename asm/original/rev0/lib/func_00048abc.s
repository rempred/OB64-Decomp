/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00048ABC..0x00048AF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, andi $a0,$a0,0xFF; jr $ra at 0x00048AE8 + delay 0x00048AEC. Un-merged from parent idx57. */
func_00048abc:
/* 0x00048ABC 0x800B86BC 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00048AC0 0x800B86C0 0x2483FFFF */ .word 0x2483FFFF # addiu $v1, $a0, -0x1
/* 0x00048AC4 0x800B86C4 0x04610002 */ .word 0x04610002 # bgez $v1, 0x800B86D0
/* 0x00048AC8 0x800B86C8 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x00048ACC 0x800B86CC 0x24820006 */ .word 0x24820006 # addiu $v0, $a0, 0x6
/* 0x00048AD0 0x800B86D0 0x000210C3 */ .word 0x000210C3 # sra $v0, $v0, 3
/* 0x00048AD4 0x800B86D4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00048AD8 0x800B86D8 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00048ADC 0x800B86DC 0x90226A81 */ .word 0x90226A81 # lbu $v0, 0x6A81($at)
/* 0x00048AE0 0x800B86E0 0x30630007 */ .word 0x30630007 # andi $v1, $v1, 0x0007
/* 0x00048AE4 0x800B86E4 0x00621007 */ .word 0x00621007 # srav $v0, $v0, $v1
/* 0x00048AE8 0x800B86E8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00048AEC 0x800B86EC 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
