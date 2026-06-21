/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001551C..0x00015560 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001551C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001551c:
/* 0x0001551C 0x8008511C 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x00015520 0x80085120 0x24639B64 */ .word 0x24639B64 # addiu $v1, $v1, -0x649C
/* 0x00015524 0x80085124 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x00015528 0x80085128 0x1040000B */ .word 0x1040000B # beq $v0, $zero, 0x80085158
/* 0x0001552C 0x8008512C 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00015530 0x80085130 0x00602021 */ .word 0x00602021 # move $a0, $v1
/* 0x00015534 0x80085134 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x00015538 0x80085138 0x8C430004 */ .word 0x8C430004 # lw $v1, 0x4($v0)
/* 0x0001553C 0x8008513C 0x00A3102A */ .word 0x00A3102A # slt $v0, $a1, $v1
/* 0x00015540 0x80085140 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x80085148
/* 0x00015544 0x80085144 0x00602821 */ .word 0x00602821 # move $a1, $v1
/* 0x00015548 0x80085148 0x24840004 */ .word 0x24840004 # addiu $a0, $a0, 0x4
/* 0x0001554C 0x8008514C 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x00015550 0x80085150 0x1440FFF8 */ .word 0x1440FFF8 # bne $v0, $zero, 0x80085134
/* 0x00015554 0x80085154 0x00000000 */ .word 0x00000000 # nop
/* 0x00015558 0x80085158 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001555C 0x8008515C 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
