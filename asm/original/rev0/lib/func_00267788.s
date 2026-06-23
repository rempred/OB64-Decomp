/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00267788..0x002677D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small leaf: addiu $sp,-0x8; FP add loop (cvt.s.w/add.s/swc1) over $a1 array; jr $ra at 0x002677C8 + nop delay. Last function in slice. */
/* function boundary candidate: func_00267788, size=72, kind=prologue */
func_00267788:
/* 0x00267788 0x802D7388 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x0026778C 0x802D738C 0x1880000D */ .word 0x1880000D # blez $a0, 0x802D73C4
/* 0x00267790 0x802D7390 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00267794 0x802D7394 0x8CA20000 */ .word 0x8CA20000 # lw $v0, 0x0($a1)
/* 0x00267798 0x802D7398 0x10400007 */ .word 0x10400007 # beq $v0, $zero, 0x802D73B8
/* 0x0026779C 0x802D739C 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x002677A0 0x802D73A0 0xC4400008 */ .word 0xC4400008 # lwc1 $f0, 0x8($v0)
/* 0x002677A4 0x802D73A4 0x44861000 */ .word 0x44861000 # mtc1 $a2, $f2
/* 0x002677A8 0x802D73A8 0x00000000 */ .word 0x00000000 # nop
/* 0x002677AC 0x802D73AC 0x468010A0 */ .word 0x468010A0 # cvt.s.w $f2, $f2
/* 0x002677B0 0x802D73B0 0x46020000 */ .word 0x46020000 # add.s $f0, $f0, $f2
/* 0x002677B4 0x802D73B4 0xE4400008 */ .word 0xE4400008 # swc1 $f0, 0x8($v0)
/* 0x002677B8 0x802D73B8 0x0064102A */ .word 0x0064102A # slt $v0, $v1, $a0
/* 0x002677BC 0x802D73BC 0x1440FFF5 */ .word 0x1440FFF5 # bne $v0, $zero, 0x802D7394
/* 0x002677C0 0x802D73C0 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x002677C4 0x802D73C4 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x002677C8 0x802D73C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002677CC 0x802D73CC 0x00000000 */ .word 0x00000000 # nop
