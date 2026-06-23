/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275D8C..0x00275DA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor: lw $v0,0x24($a0); beql $v0,$zero; sw $a1,0x24($a0). Ends jr$ra@0x275D98 + delay nop@0x275D9C. */
/* 0x00275D8C 0x802E598C 0x8C820024 */ .word 0x8C820024 # lw $v0, 0x24($a0)
/* 0x00275D90 0x802E5990 0x50400001 */ .word 0x50400001 # beql $v0, $zero, 0x802E5998
/* 0x00275D94 0x802E5994 0xAC850024 */ .word 0xAC850024 # sw $a1, 0x24($a0)
/* 0x00275D98 0x802E5998 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00275D9C 0x802E599C 0x00000000 */ .word 0x00000000 # nop
