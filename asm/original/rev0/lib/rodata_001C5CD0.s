/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C5CD0..0x001C5D00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small debug-label string span around come-here style labels; decoded in the chunk data index.. */
/* 0x001C5CD0 0x802358D0 0x636F6D65 */ .word 0x636F6D65 # daddi $t7, $k1, 0x6D65
/* 0x001C5CD4 0x802358D4 0x20686572 */ .word 0x20686572 # addi $t0, $v1, 0x6572
/* 0x001C5CD8 0x802358D8 0x65203030 */ .word 0x65203030 # daddiu $zero, $t1, 0x3030
/* 0x001C5CDC 0x802358DC 0x30000000 */ .word 0x30000000 # andi $zero, $zero, 0x0000
/* 0x001C5CE0 0x802358E0 0x636F6D65 */ .word 0x636F6D65 # daddi $t7, $k1, 0x6D65
/* 0x001C5CE4 0x802358E4 0x20686572 */ .word 0x20686572 # addi $t0, $v1, 0x6572
/* 0x001C5CE8 0x802358E8 0x65203030 */ .word 0x65203030 # daddiu $zero, $t1, 0x3030
/* 0x001C5CEC 0x802358EC 0x31000000 */ .word 0x31000000 # andi $zero, $t0, 0x0000
/* 0x001C5CF0 0x802358F0 0x636F6D65 */ .word 0x636F6D65 # daddi $t7, $k1, 0x6D65
/* 0x001C5CF4 0x802358F4 0x20686572 */ .word 0x20686572 # addi $t0, $v1, 0x6572
/* 0x001C5CF8 0x802358F8 0x65203030 */ .word 0x65203030 # daddiu $zero, $t1, 0x3030
/* 0x001C5CFC 0x802358FC 0x32000000 */ .word 0x32000000 # andi $zero, $s0, 0x0000
