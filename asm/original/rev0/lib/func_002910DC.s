/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x002910DC..0x00291104 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf, fresh fall-through entry after straddler delay slot. Loads *(0x8024DE38), beq null, lh 0x8/lh 0xA, xor, sltu predicate. jr$ra@0x002910FC + nop delay@0x00291100; nop attaches to end. */
/* 0x002910DC 0x80300CDC 0x3C038024 */ .word 0x3C038024 # lui $v1, 0x8024
/* 0x002910E0 0x80300CE0 0x8C63DE38 */ .word 0x8C63DE38 # lw $v1, -0x21C8($v1)
/* 0x002910E4 0x80300CE4 0x10600005 */ .word 0x10600005 # beq $v1, $zero, 0x80300CFC
/* 0x002910E8 0x80300CE8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002910EC 0x80300CEC 0x84620008 */ .word 0x84620008 # lh $v0, 0x8($v1)
/* 0x002910F0 0x80300CF0 0x8463000A */ .word 0x8463000A # lh $v1, 0xA($v1)
/* 0x002910F4 0x80300CF4 0x00431026 */ .word 0x00431026 # xor $v0, $v0, $v1
/* 0x002910F8 0x80300CF8 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x002910FC 0x80300CFC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00291100 0x80300D00 0x00000000 */ .word 0x00000000 # nop
