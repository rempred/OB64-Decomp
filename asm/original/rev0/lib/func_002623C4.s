/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x002623C4..0x002623E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (flag clear/set on +0xA/+0x8). jr$ra@0x2623D8 + delay 0x2623DC. */
/* 0x002623C4 0x802D1FC4 0x9482000A */ .word 0x9482000A # lhu $v0, 0xA($a0)
/* 0x002623C8 0x802D1FC8 0x94830008 */ .word 0x94830008 # lhu $v1, 0x8($a0)
/* 0x002623CC 0x802D1FCC 0x30423FFF */ .word 0x30423FFF # andi $v0, $v0, 0x3FFF
/* 0x002623D0 0x802D1FD0 0x34638000 */ .word 0x34638000 # ori $v1, $v1, 0x8000
/* 0x002623D4 0x802D1FD4 0xA482000A */ .word 0xA482000A # sh $v0, 0xA($a0)
/* 0x002623D8 0x802D1FD8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002623DC 0x802D1FDC 0xA4830008 */ .word 0xA4830008 # sh $v1, 0x8($a0)
