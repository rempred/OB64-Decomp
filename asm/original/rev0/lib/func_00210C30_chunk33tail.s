/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00211000..0x00211028 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler tail: continuation of a function whose entry is in the previous 64 KiB chunk. Incoming straddler: tail of func_00210C30 (prologue in chunk 32 @0x210C30). Restores $s0..$s7 from stack then jr$ra@0x211020 + delay addiu$sp,0xD8@0x211024. The addiu$sp delay word stays with this function; tail ends at 0x211028. */
func_00210C30_chunk33tail:
rev0_code_00211000:
/* 0x00211000 0x80280C00 0x8FB700CC */ .word 0x8FB700CC # lw $s7, 0xCC($sp)
/* 0x00211004 0x80280C04 0x8FB600C8 */ .word 0x8FB600C8 # lw $s6, 0xC8($sp)
/* 0x00211008 0x80280C08 0x8FB500C4 */ .word 0x8FB500C4 # lw $s5, 0xC4($sp)
/* 0x0021100C 0x80280C0C 0x8FB400C0 */ .word 0x8FB400C0 # lw $s4, 0xC0($sp)
/* 0x00211010 0x80280C10 0x8FB300BC */ .word 0x8FB300BC # lw $s3, 0xBC($sp)
/* 0x00211014 0x80280C14 0x8FB200B8 */ .word 0x8FB200B8 # lw $s2, 0xB8($sp)
/* 0x00211018 0x80280C18 0x8FB100B4 */ .word 0x8FB100B4 # lw $s1, 0xB4($sp)
/* 0x0021101C 0x80280C1C 0x8FB000B0 */ .word 0x8FB000B0 # lw $s0, 0xB0($sp)
/* 0x00211020 0x80280C20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00211024 0x80280C24 0x27BD00D8 */ .word 0x27BD00D8 # addiu $sp, $sp, 0xD8
