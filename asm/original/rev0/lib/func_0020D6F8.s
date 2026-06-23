/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020D6F8..0x0020D72C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf; internal j 0x801CA28C tail-jump; jr ra @0x20D724 + delay move @0x20D728. */
/* 0x0020D6F8 0x8027D2F8 0x8C830054 */ .word 0x8C830054 # lw $v1, 0x54($a0)
/* 0x0020D6FC 0x8027D2FC 0x8CA20054 */ .word 0x8CA20054 # lw $v0, 0x54($a1)
/* 0x0020D700 0x8027D300 0x14800003 */ .word 0x14800003 # bne $a0, $zero, 0x8027D310
/* 0x0020D704 0x8027D304 0x0043182A */ .word 0x0043182A # slt $v1, $v0, $v1
/* 0x0020D708 0x8027D308 0x080728A3 */ .word 0x080728A3 # j 0x801CA28C
/* 0x0020D70C 0x8027D30C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020D710 0x8027D310 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020D714 0x8027D314 0x00021202 */ .word 0x00021202 # srl $v0, $v0, 8
/* 0x0020D718 0x8027D318 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020D71C 0x8027D31C 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x8027D324
/* 0x0020D720 0x8027D320 0x2C630001 */ .word 0x2C630001 # sltiu $v1, $v1, 0x1
/* 0x0020D724 0x8027D324 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020D728 0x8027D328 0x00601021 */ .word 0x00601021 # move $v0, $v1
