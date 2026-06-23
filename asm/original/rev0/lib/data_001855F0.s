/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00181000_00191000.s
 * z64 range: 0x001855F0..0x00185600 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two repeated 8-byte records: 0x028001E0 / 0x01FF0000. Small fixed record pair; semantics undecoded.. */
/* 0x001855F0 0x801F51F0 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x001855F4 0x801F51F4 0x01FF0000 */ .word 0x01FF0000 # sll $zero, $ra, 0
/* 0x001855F8 0x801F51F8 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x001855FC 0x801F51FC 0x01FF0000 */ .word 0x01FF0000 # sll $zero, $ra, 0
