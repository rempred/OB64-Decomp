/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101000..0x00101024 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Incoming straddler tail: final 9 words [0x101000,0x101024) that COMPLETE a truncated fixed-stride 0x50-byte (20-word) float/param record begun at 0x100FD4 in chunk 15. word[11] at 0x101000=0x42340000 (=45.0f). Body is mostly IEEE-754 single floats and zero pads: 0x42340000(45.0), 0xC0C00000(-6.0), 0x41B80000(23.0), 0x41C00000(24.0), 0x42000000(32.0), 0x42880000(68.0), 0x42C20000(97.0), 0x42B00000(88.0), 0x42960000(75.0) interleaved with 0x00000000 fillers. Record completes exactly at 0x101024 where the same 0x50-byte table restarts.. */
rev0_code_00101000:
/* 0x00101000 0x80170C00 0x42340000 */ .word 0x42340000 # cop0_0x11
/* 0x00101004 0x80170C04 0x00000000 */ .word 0x00000000 # nop
/* 0x00101008 0x80170C08 0x00000000 */ .word 0x00000000 # nop
/* 0x0010100C 0x80170C0C 0xC0C00000 */ .word 0xC0C00000 # ll $zero, 0x0($a2)
/* 0x00101010 0x80170C10 0x41B80000 */ .word 0x41B80000 # cop0_0x0D
/* 0x00101014 0x80170C14 0x41C00000 */ .word 0x41C00000 # cop0_0x0E
/* 0x00101018 0x80170C18 0x42000000 */ .word 0x42000000 # cop0_0x10
/* 0x0010101C 0x80170C1C 0x00000000 */ .word 0x00000000 # nop
/* 0x00101020 0x80170C20 0x00000000 */ .word 0x00000000 # nop
