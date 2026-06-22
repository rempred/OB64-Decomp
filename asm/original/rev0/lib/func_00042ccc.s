/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00042CCC..0x00042CF4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, entry lw $v0,0x0($a0); jr $ra at 0x42CEC + delay sb */
func_00042ccc:
/* 0x00042CCC 0x800B28CC 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x00042CD0 0x800B28D0 0x8C830000 */ .word 0x8C830000 # lw $v1, 0x0($a0)
/* 0x00042CD4 0x800B28D4 0x000217C2 */ .word 0x000217C2 # srl $v0, $v0, 31
/* 0x00042CD8 0x800B28D8 0x00031EC2 */ .word 0x00031EC2 # srl $v1, $v1, 27
/* 0x00042CDC 0x800B28DC 0x3063000F */ .word 0x3063000F # andi $v1, $v1, 0x000F
/* 0x00042CE0 0x800B28E0 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x00042CE4 0x800B28E4 0xA0227030 */ .word 0xA0227030 # sb $v0, 0x7030($at)
/* 0x00042CE8 0x800B28E8 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x00042CEC 0x800B28EC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00042CF0 0x800B28F0 0xA0237031 */ .word 0xA0237031 # sb $v1, 0x7031($at)
