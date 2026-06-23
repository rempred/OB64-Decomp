/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x00131000..0x00131050 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler tail: continuation of a function whose entry is in the previous 64 KiB chunk. Continuation tail of func_00130E60 (true entry in chunk 18). Loop body + lw $ra/jr $ra at 0x131048 + delay 0x13104C; returns before parent end 0x131050. */
rev0_code_00131000:
/* 0x00131000 0x801A0C00 0x10A0000A */ .word 0x10A0000A # beq $a1, $zero, 0x801A0C2C
/* 0x00131004 0x801A0C04 0x24020028 */ .word 0x24020028 # addiu $v0, $zero, 0x28
/* 0x00131008 0x801A0C08 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0013100C 0x801A0C0C 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x00131010 0x801A0C10 0x0807723B */ .word 0x0807723B # j 0x801DC8EC
/* 0x00131014 0x801A0C14 0xA0273AC2 */ .word 0xA0273AC2 # sb $a3, 0x3AC2($at)
/* 0x00131018 0x801A0C18 0x24C60001 */ .word 0x24C60001 # addiu $a2, $a2, 0x1
/* 0x0013101C 0x801A0C1C 0x28C20028 */ .word 0x28C20028 # slti $v0, $a2, 0x28
/* 0x00131020 0x801A0C20 0x1440FFF0 */ .word 0x1440FFF0 # bne $v0, $zero, 0x801A0BE4
/* 0x00131024 0x801A0C24 0x24840004 */ .word 0x24840004 # addiu $a0, $a0, 0x4
/* 0x00131028 0x801A0C28 0x24020028 */ .word 0x24020028 # addiu $v0, $zero, 0x28
/* 0x0013102C 0x801A0C2C 0x14C20005 */ .word 0x14C20005 # bne $a2, $v0, 0x801A0C44
/* 0x00131030 0x801A0C30 0x00000000 */ .word 0x00000000 # nop
/* 0x00131034 0x801A0C34 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x00131038 0x801A0C38 0x2484E8C8 */ .word 0x2484E8C8 # addiu $a0, $a0, -0x1738
/* 0x0013103C 0x801A0C3C 0x0C024D50 */ .word 0x0C024D50 # jal 0x80093540
/* 0x00131040 0x801A0C40 0x01002821 */ .word 0x01002821 # move $a1, $t0
/* 0x00131044 0x801A0C44 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00131048 0x801A0C48 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0013104C 0x801A0C4C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
