/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026C1F0..0x0026C230 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame 0x28, FP code: lwc1/neg.s/swc1 negating a 3-component vector then jal 0x8020A980. All-code (FP), not data. Ends jr$ra@0x0026C228 + delay@0x0026C22C. */
/* function boundary candidate: func_0026C1F0, size=64, kind=prologue */
func_0026C1F0:
/* 0x0026C1F0 0x802DBDF0 0x27BDFFD8 */ .word 0x27BDFFD8 # addiu $sp, $sp, -0x28
/* 0x0026C1F4 0x802DBDF4 0xAFBF0020 */ .word 0xAFBF0020 # sw $ra, 0x20($sp)
/* 0x0026C1F8 0x802DBDF8 0xC4800000 */ .word 0xC4800000 # lwc1 $f0, 0x0($a0)
/* 0x0026C1FC 0x802DBDFC 0x46000007 */ .word 0x46000007 # neg.s $f0, $f0
/* 0x0026C200 0x802DBE00 0xE7A00010 */ .word 0xE7A00010 # swc1 $f0, 0x10($sp)
/* 0x0026C204 0x802DBE04 0xC4800004 */ .word 0xC4800004 # lwc1 $f0, 0x4($a0)
/* 0x0026C208 0x802DBE08 0x46000007 */ .word 0x46000007 # neg.s $f0, $f0
/* 0x0026C20C 0x802DBE0C 0xE7A00014 */ .word 0xE7A00014 # swc1 $f0, 0x14($sp)
/* 0x0026C210 0x802DBE10 0xC4800008 */ .word 0xC4800008 # lwc1 $f0, 0x8($a0)
/* 0x0026C214 0x802DBE14 0x46000007 */ .word 0x46000007 # neg.s $f0, $f0
/* 0x0026C218 0x802DBE18 0x27A40010 */ .word 0x27A40010 # addiu $a0, $sp, 0x10
/* 0x0026C21C 0x802DBE1C 0x0C082A60 */ .word 0x0C082A60 # jal 0x8020A980
/* 0x0026C220 0x802DBE20 0xE7A00018 */ .word 0xE7A00018 # swc1 $f0, 0x18($sp)
/* 0x0026C224 0x802DBE24 0x8FBF0020 */ .word 0x8FBF0020 # lw $ra, 0x20($sp)
/* 0x0026C228 0x802DBE28 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026C22C 0x802DBE2C 0x27BD0028 */ .word 0x27BD0028 # addiu $sp, $sp, 0x28
