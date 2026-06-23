/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00280F2C..0x00280F4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Second small-int LUT block: 8 words, small values 0x0F,0x10,0x0F,0x11,0x10,0x16,0x1A,0x17 (same per-entry small-int format as table_00280d5c).. */
/* 0x00280F2C 0x802F0B2C 0x0000000F */ .word 0x0000000F # sync
/* 0x00280F30 0x802F0B30 0x00000010 */ .word 0x00000010 # mfhi $zero
/* 0x00280F34 0x802F0B34 0x0000000F */ .word 0x0000000F # sync
/* 0x00280F38 0x802F0B38 0x00000011 */ .word 0x00000011 # mthi $zero
/* 0x00280F3C 0x802F0B3C 0x00000010 */ .word 0x00000010 # mfhi $zero
/* 0x00280F40 0x802F0B40 0x00000016 */ .word 0x00000016 # dsrlv $zero, $zero, $zero
/* 0x00280F44 0x802F0B44 0x0000001A */ .word 0x0000001A # div $zero, $zero
/* 0x00280F48 0x802F0B48 0x00000017 */ .word 0x00000017 # dsrav $zero, $zero, $zero
