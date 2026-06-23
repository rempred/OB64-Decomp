/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DADD0..0x000DAE10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small-int index + 16-bit value blocks. 0xDADD0: byte index ramp '00 01 02 03 03 03 02 01' (8 bytes, symmetric). 0xDADD8-0xDADE7: ascending big-endian u16 ramp 0x00A0,0x00C0,0x00E0,0x0100,0x0120,0x0140,0x0160,0x0180 (stride 0x20, pixel/coord positions) then 0x0820,0x0000. 0xDADEC: zero word. 0xDADF0-0xDAE0F: 8 signed u16 (x,y) coordinate pairs: (-19,6),(-38,12),(10,15),(-9,21),(-28,27),(20,30),(1,36),(-18,42). Hypothesis: layout offset tables for the formation/menu UI.. */
/* 0x000DADD0 0x8014A9D0 0x00010203 */ .word 0x00010203 # sra $zero, $at, 8
/* 0x000DADD4 0x8014A9D4 0x03030201 */ .word 0x03030201 # special_0x01
/* 0x000DADD8 0x8014A9D8 0x00A000C0 */ .word 0x00A000C0 # sll $zero, $zero, 3
/* 0x000DADDC 0x8014A9DC 0x00E00100 */ .word 0x00E00100 # sll $zero, $zero, 4
/* 0x000DADE0 0x8014A9E0 0x01200140 */ .word 0x01200140 # sll $zero, $zero, 5
/* 0x000DADE4 0x8014A9E4 0x01600180 */ .word 0x01600180 # sll $zero, $zero, 6
/* 0x000DADE8 0x8014A9E8 0x08200000 */ .word 0x08200000 # j 0x80800000
/* 0x000DADEC 0x8014A9EC 0x00000000 */ .word 0x00000000 # nop
/* 0x000DADF0 0x8014A9F0 0xFFED0006 */ .word 0xFFED0006 # sd $t5, 0x6($ra)
/* 0x000DADF4 0x8014A9F4 0xFFDA000C */ .word 0xFFDA000C # sd $k0, 0xC($s8)
/* 0x000DADF8 0x8014A9F8 0x000A000F */ .word 0x000A000F # sync
/* 0x000DADFC 0x8014A9FC 0xFFF70015 */ .word 0xFFF70015 # sd $s7, 0x15($ra)
/* 0x000DAE00 0x8014AA00 0xFFE4001B */ .word 0xFFE4001B # sd $a0, 0x1B($ra)
/* 0x000DAE04 0x8014AA04 0x0014001E */ .word 0x0014001E # ddiv $zero, $s4
/* 0x000DAE08 0x8014AA08 0x00010024 */ .word 0x00010024 # and $zero, $zero, $at
/* 0x000DAE0C 0x8014AA0C 0xFFEE002A */ .word 0xFFEE002A # sd $t6, 0x2A($ra)
