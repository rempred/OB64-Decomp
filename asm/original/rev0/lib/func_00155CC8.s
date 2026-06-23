/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x00155CC8..0x00155CF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* addiu $sp,-0x18; jal then store result; jr $ra 0x00155CE8 + delay 0x00155CEC. */
/* function boundary candidate: func_00155CC8, size=40, kind=prologue */
func_00155CC8:
/* 0x00155CC8 0x801C58C8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00155CCC 0x801C58CC 0x3C0401DF */ .word 0x3C0401DF # lui $a0, 0x01DF
/* 0x00155CD0 0x801C58D0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00155CD4 0x801C58D4 0x0C02774E */ .word 0x0C02774E # jal 0x8009DD38
/* 0x00155CD8 0x801C58D8 0x348498EA */ .word 0x348498EA # ori $a0, $a0, 0x98EA
/* 0x00155CDC 0x801C58DC 0x3C018021 */ .word 0x3C018021 # lui $at, 0x8021
/* 0x00155CE0 0x801C58E0 0xAC224F5C */ .word 0xAC224F5C # sw $v0, 0x4F5C($at)
/* 0x00155CE4 0x801C58E4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00155CE8 0x801C58E8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00155CEC 0x801C58EC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
