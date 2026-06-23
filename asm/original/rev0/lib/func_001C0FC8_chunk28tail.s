/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C1000..0x001C1024 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler tail: continuation of a function whose entry is in the previous 64 KiB chunk. Incoming continuation of func_001C0FC8 from chunk 27. Tail stores resource/UI state, restores $ra/$s0, returns via jr$ra@0x1C101C with stack-restore delay @0x1C1020; first fresh chunk-28 function begins at 0x1C1024. */
func_001C0FC8_chunk28tail:
rev0_code_001C1000:
/* 0x001C1000 0x80230C00 0xAE02004C */ .word 0xAE02004C # sw $v0, 0x4C($s0)
/* 0x001C1004 0x80230C04 0xA6030014 */ .word 0xA6030014 # sh $v1, 0x14($s0)
/* 0x001C1008 0x80230C08 0xA6030048 */ .word 0xA6030048 # sh $v1, 0x48($s0)
/* 0x001C100C 0x80230C0C 0x2484002C */ .word 0x2484002C # addiu $a0, $a0, 0x2C
/* 0x001C1010 0x80230C10 0xA6040020 */ .word 0xA6040020 # sh $a0, 0x20($s0)
/* 0x001C1014 0x80230C14 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x001C1018 0x80230C18 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x001C101C 0x80230C1C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001C1020 0x80230C20 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
