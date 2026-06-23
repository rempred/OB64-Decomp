/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C5A5C..0x001C5AAC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Pointer/id map following the stronghold tutorial text pool; target semantics unresolved.. */
/* 0x001C5A5C 0x8023565C 0xFFFFFFFF */ .word 0xFFFFFFFF # sd $ra, -0x1($ra)
/* 0x001C5A60 0x80235660 0x8022D6B4 */ .word 0x8022D6B4 # lb $v0, -0x294C($at)
/* 0x001C5A64 0x80235664 0x00000007 */ .word 0x00000007 # srav $zero, $zero, $zero
/* 0x001C5A68 0x80235668 0x8022DC10 */ .word 0x8022DC10 # lb $v0, -0x23F0($at)
/* 0x001C5A6C 0x8023566C 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x001C5A70 0x80235670 0x8022E234 */ .word 0x8022E234 # lb $v0, -0x1DCC($at)
/* 0x001C5A74 0x80235674 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x001C5A78 0x80235678 0x8022E370 */ .word 0x8022E370 # lb $v0, -0x1C90($at)
/* 0x001C5A7C 0x8023567C 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x001C5A80 0x80235680 0x8022EE8C */ .word 0x8022EE8C # lb $v0, -0x1174($at)
/* 0x001C5A84 0x80235684 0x00000005 */ .word 0x00000005 # special_0x05
/* 0x001C5A88 0x80235688 0x8022F0EC */ .word 0x8022F0EC # lb $v0, -0xF14($at)
/* 0x001C5A8C 0x8023568C 0x00000006 */ .word 0x00000006 # srlv $zero, $zero, $zero
/* 0x001C5A90 0x80235690 0x8022F484 */ .word 0x8022F484 # lb $v0, -0xB7C($at)
/* 0x001C5A94 0x80235694 0x00000001 */ .word 0x00000001 # special_0x01
/* 0x001C5A98 0x80235698 0x8022F608 */ .word 0x8022F608 # lb $v0, -0x9F8($at)
/* 0x001C5A9C 0x8023569C 0x00000008 */ .word 0x00000008 # jr $zero
/* 0x001C5AA0 0x802356A0 0x8022FB50 */ .word 0x8022FB50 # lb $v0, -0x4B0($at)
/* 0x001C5AA4 0x802356A4 0x00000009 */ .word 0x00000009 # jalr $zero, $zero
/* 0x001C5AA8 0x802356A8 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
