/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A1424..0x001A1440 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small frameless leaf, entry 0x1A1424 lui $v0,0x8022; lbu $v0,-0x4B2A($v0) (reads a current-index global), indexes -0x4B58($at), jr$ra@0x1A1438 + delay sltiu $v0,$v0,0x1@0x1A143C (returns a boolean in $v0). */
func_001A1424:
/* 0x001A1424 0x80211024 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x001A1428 0x80211028 0x9042B4D6 */ .word 0x9042B4D6 # lbu $v0, -0x4B2A($v0)
/* 0x001A142C 0x8021102C 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x001A1430 0x80211030 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x001A1434 0x80211034 0x9022B4A8 */ .word 0x9022B4A8 # lbu $v0, -0x4B58($at)
/* 0x001A1438 0x80211038 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001A143C 0x8021103C 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
