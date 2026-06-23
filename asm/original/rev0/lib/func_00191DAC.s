/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x00191DAC..0x00191DE8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed function, prologue addiu $sp,-0x18@0x191DAC; saves $ra. Calls jal 0x80200A38, then emits an E700 DL gfx command via global DL pointer -0x6460($at). Ends jr $ra@0x191DE0 + delay addiu $sp,0x18@0x191DE4. */
/* function boundary candidate: func_00191DAC, size=60, kind=prologue */
func_00191DAC:
/* 0x00191DAC 0x802019AC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00191DB0 0x802019B0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00191DB4 0x802019B4 0x0C08028E */ .word 0x0C08028E # jal 0x80200A38
/* 0x00191DB8 0x802019B8 0x00000000 */ .word 0x00000000 # nop
/* 0x00191DBC 0x802019BC 0x3C02800F */ .word 0x3C02800F # lui $v0, 0x800F
/* 0x00191DC0 0x802019C0 0x8C429BA0 */ .word 0x8C429BA0 # lw $v0, -0x6460($v0)
/* 0x00191DC4 0x802019C4 0x24430008 */ .word 0x24430008 # addiu $v1, $v0, 0x8
/* 0x00191DC8 0x802019C8 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x00191DCC 0x802019CC 0xAC239BA0 */ .word 0xAC239BA0 # sw $v1, -0x6460($at)
/* 0x00191DD0 0x802019D0 0x3C03E700 */ .word 0x3C03E700 # lui $v1, 0xE700
/* 0x00191DD4 0x802019D4 0xAC430000 */ .word 0xAC430000 # sw $v1, 0x0($v0)
/* 0x00191DD8 0x802019D8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00191DDC 0x802019DC 0xAC400004 */ .word 0xAC400004 # sw $zero, 0x4($v0)
/* 0x00191DE0 0x802019E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00191DE4 0x802019E4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
