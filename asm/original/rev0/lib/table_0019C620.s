/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x0019C620..0x0019C688 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table (handler/jump-pointer array; targets are relocated 0x8021/0x8016-band code/data, NOT local-rodata string pointers). Overlay-relocated targets. RAM pointer table, 0x8021 band (25 entries). Dominated by repeated 0x80218988 (13 occurrences) with a few distinct neighbors: 0x80218990 x2, 0x80218998 x5, 0x802189A0 x2, 0x802189A8, 0x802189B0. Pattern of repeats indicates a default-fill pointer index table. Trailing single zero word at 0x19C684 folded in as terminator.. */
/* 0x0019C620 0x8020C220 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C624 0x8020C224 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C628 0x8020C228 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C62C 0x8020C22C 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C630 0x8020C230 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C634 0x8020C234 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C638 0x8020C238 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C63C 0x8020C23C 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C640 0x8020C240 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C644 0x8020C244 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C648 0x8020C248 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C64C 0x8020C24C 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C650 0x8020C250 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C654 0x8020C254 0x80218990 */ .word 0x80218990 # lb $at, -0x7670($at)
/* 0x0019C658 0x8020C258 0x80218990 */ .word 0x80218990 # lb $at, -0x7670($at)
/* 0x0019C65C 0x8020C25C 0x80218998 */ .word 0x80218998 # lb $at, -0x7668($at)
/* 0x0019C660 0x8020C260 0x80218998 */ .word 0x80218998 # lb $at, -0x7668($at)
/* 0x0019C664 0x8020C264 0x80218998 */ .word 0x80218998 # lb $at, -0x7668($at)
/* 0x0019C668 0x8020C268 0x80218998 */ .word 0x80218998 # lb $at, -0x7668($at)
/* 0x0019C66C 0x8020C26C 0x80218998 */ .word 0x80218998 # lb $at, -0x7668($at)
/* 0x0019C670 0x8020C270 0x802189A0 */ .word 0x802189A0 # lb $at, -0x7660($at)
/* 0x0019C674 0x8020C274 0x802189A0 */ .word 0x802189A0 # lb $at, -0x7660($at)
/* 0x0019C678 0x8020C278 0x802189A8 */ .word 0x802189A8 # lb $at, -0x7658($at)
/* 0x0019C67C 0x8020C27C 0x80218988 */ .word 0x80218988 # lb $at, -0x7678($at)
/* 0x0019C680 0x8020C280 0x802189B0 */ .word 0x802189B0 # lb $at, -0x7650($at)
/* 0x0019C684 0x8020C284 0x00000000 */ .word 0x00000000 # nop
