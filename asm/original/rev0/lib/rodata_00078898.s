/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00078898..0x000788A8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): rodata short tokens (16 bytes): 'EB' (4542) and 'NOBE' (4E4F4245), NUL/zero-padded. Save-slot/note magic or label strings.. */
/* 0x00078898 0x800E8498 0x45420000 */ .word 0x45420000 # add.fmt10 $f0, $f0, $f2
/* 0x0007889C 0x800E849C 0x4E4F4245 */ .word 0x4E4F4245 # op_0x13
/* 0x000788A0 0x800E84A0 0x00000000 */ .word 0x00000000 # nop
/* 0x000788A4 0x800E84A4 0x00000000 */ .word 0x00000000 # nop
