/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024C3A0..0x0024C3EC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded FORWARD (honest classification of the 20B gap [0x0024C3A0,0x0024C3B4)): it is a read-before-write divide-by-3 preamble (lui $v1,0x5555/ori 0x5556; andi $a0,0xFF; addiu -0x14; mult $v0,$v1) whose HI is consumed by the mfhi at prologue body 0x0024C3C0 - NOT inline data. True prologue addiu$sp,-0x18 at 0x0024C3B4; *3 then jal 0x801CA1C4; sign-extend. jr$ra@0x0024C3E4 + delay addiu$sp,0x18@0x0024C3E8. Slice end. Name==part start. */
func_0024C3A0:
/* 0x0024C3A0 0x802BBFA0 0x3C035555 */ .word 0x3C035555 # lui $v1, 0x5555
/* 0x0024C3A4 0x802BBFA4 0x34635556 */ .word 0x34635556 # ori $v1, $v1, 0x5556
/* 0x0024C3A8 0x802BBFA8 0x308200FF */ .word 0x308200FF # andi $v0, $a0, 0x00FF
/* 0x0024C3AC 0x802BBFAC 0x2442FFEC */ .word 0x2442FFEC # addiu $v0, $v0, -0x14
/* 0x0024C3B0 0x802BBFB0 0x00430018 */ .word 0x00430018 # mult $v0, $v1

/* function boundary candidate: func_0024C3B4, size=56, kind=prologue */
func_0024C3B4:
/* 0x0024C3B4 0x802BBFB4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0024C3B8 0x802BBFB8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0024C3BC 0x802BBFBC 0x00022FC3 */ .word 0x00022FC3 # sra $a1, $v0, 31
/* 0x0024C3C0 0x802BBFC0 0x00003010 */ .word 0x00003010 # mfhi $a2
/* 0x0024C3C4 0x802BBFC4 0x00C52823 */ .word 0x00C52823 # subu $a1, $a2, $a1
/* 0x0024C3C8 0x802BBFC8 0x00052040 */ .word 0x00052040 # sll $a0, $a1, 1
/* 0x0024C3CC 0x802BBFCC 0x00852021 */ .word 0x00852021 # addu $a0, $a0, $a1
/* 0x0024C3D0 0x802BBFD0 0x0C072871 */ .word 0x0C072871 # jal 0x801CA1C4
/* 0x0024C3D4 0x802BBFD4 0x00442023 */ .word 0x00442023 # subu $a0, $v0, $a0
/* 0x0024C3D8 0x802BBFD8 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x0024C3DC 0x802BBFDC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0024C3E0 0x802BBFE0 0x00021403 */ .word 0x00021403 # sra $v0, $v0, 16
/* 0x0024C3E4 0x802BBFE4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024C3E8 0x802BBFE8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
