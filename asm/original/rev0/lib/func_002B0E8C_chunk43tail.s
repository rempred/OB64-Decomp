/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B1000..0x002B1014 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler tail: continuation of a function whose entry is in the previous 64 KiB chunk. Incoming straddler: continues func_002B0E8C (prologue addiu$sp,-0x140 in chunk 42). Epilogue lw s2,0x120 / s1,0x11C / s0,0x118 then jr$ra@0x002B100C + delay addiu$sp,0x140@0x002B1010. Ends exactly at 0x002B1014. */
func_002B0E8C_chunk43tail:
rev0_code_002B1000:
/* 0x002B1000 0x80320C00 0x8FB20120 */ .word 0x8FB20120 # lw $s2, 0x120($sp)
/* 0x002B1004 0x80320C04 0x8FB1011C */ .word 0x8FB1011C # lw $s1, 0x11C($sp)
/* 0x002B1008 0x80320C08 0x8FB00118 */ .word 0x8FB00118 # lw $s0, 0x118($sp)
/* 0x002B100C 0x80320C0C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B1010 0x80320C10 0x27BD0140 */ .word 0x27BD0140 # addiu $sp, $sp, 0x140
