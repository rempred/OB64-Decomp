/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/lib/table_text_vm_jump_table.s
 * z64 range: 0x00038AFC..0x00038B2C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 11 overlay group pointers followed by the required null word. */
/* 0x00038AFC 0x800A86FC 0x800A86B8 */ .word 0x800A86B8 # lb $t2, -0x7948($zero)
/* 0x00038B00 0x800A8700 0x800A86BC */ .word 0x800A86BC # lb $t2, -0x7944($zero)
/* 0x00038B04 0x800A8704 0x800A86C4 */ .word 0x800A86C4 # lb $t2, -0x793C($zero)
/* 0x00038B08 0x800A8708 0x800A86CC */ .word 0x800A86CC # lb $t2, -0x7934($zero)
/* 0x00038B0C 0x800A870C 0x800A86D0 */ .word 0x800A86D0 # lb $t2, -0x7930($zero)
/* 0x00038B10 0x800A8710 0x800A86D4 */ .word 0x800A86D4 # lb $t2, -0x792C($zero)
/* 0x00038B14 0x800A8714 0x800A86D8 */ .word 0x800A86D8 # lb $t2, -0x7928($zero)
/* 0x00038B18 0x800A8718 0x800A86E4 */ .word 0x800A86E4 # lb $t2, -0x791C($zero)
/* 0x00038B1C 0x800A871C 0x800A86EC */ .word 0x800A86EC # lb $t2, -0x7914($zero)
/* 0x00038B20 0x800A8720 0x800A86F0 */ .word 0x800A86F0 # lb $t2, -0x7910($zero)
/* 0x00038B24 0x800A8724 0x800A86F8 */ .word 0x800A86F8 # lb $t2, -0x7908($zero)
/* 0x00038B28 0x800A8728 0x00000000 */ .word 0x00000000 # nop
