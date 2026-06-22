/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005D510..0x0005D560 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Descriptor table of (RAM pointer, count) pairs followed by zero pad. Header word 0x1C021000 at 0x5D510, then 6 pairs: (0x80195560,0x34) (0x801875A4,0x64) (0x801974DE,0x19) (0x801870AC,0x14) (0x801951B0,0x24) (0x80187610,0x10). Pointers are RAM (0x80xxxxxx) addressing other tables/strings; second word of each pair is a small count/length. Trailing 6-word zero pad 0x5D548..0x5D560.. */
/* 0x0005D510 0x800CD110 0x1C021000 */ .word 0x1C021000 # bgtz $zero, 0x800D1114
/* 0x0005D514 0x800CD114 0x00000000 */ .word 0x00000000 # nop
/* 0x0005D518 0x800CD118 0x80195560 */ .word 0x80195560 # lb $t9, 0x5560($zero)
/* 0x0005D51C 0x800CD11C 0x00000034 */ .word 0x00000034 # teq $zero, $zero
/* 0x0005D520 0x800CD120 0x801875A4 */ .word 0x801875A4 # lb $t8, 0x75A4($zero)
/* 0x0005D524 0x800CD124 0x00000064 */ .word 0x00000064 # and $zero, $zero, $zero
/* 0x0005D528 0x800CD128 0x801974DE */ .word 0x801974DE # lb $t9, 0x74DE($zero)
/* 0x0005D52C 0x800CD12C 0x00000019 */ .word 0x00000019 # multu $zero, $zero
/* 0x0005D530 0x800CD130 0x801870AC */ .word 0x801870AC # lb $t8, 0x70AC($zero)
/* 0x0005D534 0x800CD134 0x00000014 */ .word 0x00000014 # dsllv $zero, $zero, $zero
/* 0x0005D538 0x800CD138 0x801951B0 */ .word 0x801951B0 # lb $t9, 0x51B0($zero)
/* 0x0005D53C 0x800CD13C 0x00000024 */ .word 0x00000024 # and $zero, $zero, $zero
/* 0x0005D540 0x800CD140 0x80187610 */ .word 0x80187610 # lb $t8, 0x7610($zero)
/* 0x0005D544 0x800CD144 0x00000010 */ .word 0x00000010 # mfhi $zero
/* 0x0005D548 0x800CD148 0x00000000 */ .word 0x00000000 # nop
/* 0x0005D54C 0x800CD14C 0x00000000 */ .word 0x00000000 # nop
/* 0x0005D550 0x800CD150 0x00000000 */ .word 0x00000000 # nop
/* 0x0005D554 0x800CD154 0x00000000 */ .word 0x00000000 # nop
/* 0x0005D558 0x800CD158 0x00000000 */ .word 0x00000000 # nop
/* 0x0005D55C 0x800CD15C 0x00000000 */ .word 0x00000000 # nop
