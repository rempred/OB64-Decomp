/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/lib/func_00040f88_chunk3head.s
 * z64 range: 0x00040FF4..0x00041000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler head: this function begins here and continues into the next 64 KiB chunk. func_00040FF4 [0x40FF4,0x41098): byte-arg clamp/divide helper; its tail is func_00040ff4_chunk4tail [0x41000,0x41098) in chunk 4. (Previously mis-split as 'func_00040f88_chunk3head', which incorrectly implied the whole span was func_00040F88.) */
func_00040ff4_chunk3head:
/* 0x00040FF4 0x800B0BF4 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00040FF8 0x800B0BF8 0x1080000C */ .word 0x1080000C # beq $a0, $zero, 0x800B0C2C
/* 0x00040FFC 0x800B0BFC 0x00000000 */ .word 0x00000000 # nop
