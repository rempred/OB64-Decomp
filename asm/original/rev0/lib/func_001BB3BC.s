/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB3BC..0x001BB3F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: lhu 0x2C($a0) branch; j 0x802222D4 internal tail-jump; jr $ra(0x1BB3E8)+delay move $v0,$zero(0x1BB3EC). */
func_001BB3BC:
/* 0x001BB3BC 0x8022AFBC 0x9482002C */ .word 0x9482002C # lhu $v0, 0x2C($a0)
/* 0x001BB3C0 0x8022AFC0 0x14400006 */ .word 0x14400006 # bne $v0, $zero, 0x8022AFDC
/* 0x001BB3C4 0x8022AFC4 0x00000000 */ .word 0x00000000 # nop
/* 0x001BB3C8 0x8022AFC8 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB3CC 0x8022AFCC 0x8C430004 */ .word 0x8C430004 # lw $v1, 0x4($v0)
/* 0x001BB3D0 0x8022AFD0 0x8C820004 */ .word 0x8C820004 # lw $v0, 0x4($a0)
/* 0x001BB3D4 0x8022AFD4 0x080888B5 */ .word 0x080888B5 # j 0x802222D4
/* 0x001BB3D8 0x8022AFD8 0x00621021 */ .word 0x00621021 # addu $v0, $v1, $v0
/* 0x001BB3DC 0x8022AFDC 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB3E0 0x8022AFE0 0x24420008 */ .word 0x24420008 # addiu $v0, $v0, 0x8
/* 0x001BB3E4 0x8022AFE4 0xAC820008 */ .word 0xAC820008 # sw $v0, 0x8($a0)
/* 0x001BB3E8 0x8022AFE8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB3EC 0x8022AFEC 0x00001021 */ .word 0x00001021 # move $v0, $zero
