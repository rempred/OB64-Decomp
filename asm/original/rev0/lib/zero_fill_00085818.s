/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x00085818..0x00085820 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two all-zero words (0x00000000) — 8-byte alignment-pad NOPs separating the preceding code (ends 0x85810 jr $ra) from the packed data blob that follows. Small but a clean alignment boundary.. */
/* 0x00085818 0x800F5418 0x00000000 */ .word 0x00000000 # nop
/* 0x0008581C 0x800F541C 0x00000000 */ .word 0x00000000 # nop
