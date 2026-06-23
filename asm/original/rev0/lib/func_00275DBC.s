/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275DBC..0x00275DC4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 2-word frameless leaf setter: jr$ra@0x275DBC + delay sh$a1,0x22($a0)@0x275DC0. */
/* 0x00275DBC 0x802E59BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00275DC0 0x802E59C0 0xA4850022 */ .word 0xA4850022 # sh $a1, 0x22($a0)
