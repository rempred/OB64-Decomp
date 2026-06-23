/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C5AAC..0x001C5AD0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Float/scalar parameter block for the stronghold/tutorial data island; includes 0.25/0.5/0.75-like values.. */
/* 0x001C5AAC 0x802356AC 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x001C5AB0 0x802356B0 0x3E800000 */ .word 0x3E800000 # lui $zero, 0x0000
/* 0x001C5AB4 0x802356B4 0x3F000000 */ .word 0x3F000000 # lui $zero, 0x0000
/* 0x001C5AB8 0x802356B8 0x3F400000 */ .word 0x3F400000 # lui $zero, 0x0000
/* 0x001C5ABC 0x802356BC 0x00000000 */ .word 0x00000000 # nop
/* 0x001C5AC0 0x802356C0 0x0000002D */ .word 0x0000002D # daddu $zero, $zero, $zero
/* 0x001C5AC4 0x802356C4 0x00000009 */ .word 0x00000009 # jalr $zero, $zero
/* 0x001C5AC8 0x802356C8 0x0000001E */ .word 0x0000001E # ddiv $zero, $zero
/* 0x001C5ACC 0x802356CC 0x00000014 */ .word 0x00000014 # dsllv $zero, $zero, $zero
