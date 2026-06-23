/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00267928..0x00267994 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered FRAMELESS leaf (fall-through entry after prior return; starts 'move $v1,$zero', no stack prologue). Binary-search-like scan over halfword pairs; ends with internal j 0x80212D80 dispatch then jr $ra @0x267988 + lh delay slot @0x26798C. The dead 4B word @0x267990 (mtc1 $a1,$f4, alignment-filler/orphan) is attached here to preserve contiguity to 0x00267994. */
/* 0x00267928 0x802D7528 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0026792C 0x802D752C 0x2407FFFF */ .word 0x2407FFFF # addiu $a3, $zero, -0x1
/* 0x00267930 0x802D7530 0x00031080 */ .word 0x00031080 # sll $v0, $v1, 2
/* 0x00267934 0x802D7534 0x00453021 */ .word 0x00453021 # addu $a2, $v0, $a1
/* 0x00267938 0x802D7538 0x84C20000 */ .word 0x84C20000 # lh $v0, 0x0($a2)
/* 0x0026793C 0x802D753C 0x14470004 */ .word 0x14470004 # bne $v0, $a3, 0x802D7550
/* 0x00267940 0x802D7540 0x00031080 */ .word 0x00031080 # sll $v0, $v1, 2
/* 0x00267944 0x802D7544 0x84C20002 */ .word 0x84C20002 # lh $v0, 0x2($a2)
/* 0x00267948 0x802D7548 0x10400009 */ .word 0x10400009 # beq $v0, $zero, 0x802D7570
/* 0x0026794C 0x802D754C 0x00031080 */ .word 0x00031080 # sll $v0, $v1, 2
/* 0x00267950 0x802D7550 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00267954 0x802D7554 0x84420000 */ .word 0x84420000 # lh $v0, 0x0($v0)
/* 0x00267958 0x802D7558 0x10820009 */ .word 0x10820009 # beq $a0, $v0, 0x802D7580
/* 0x0026795C 0x802D755C 0x0082102A */ .word 0x0082102A # slt $v0, $a0, $v0
/* 0x00267960 0x802D7560 0x54400004 */ .word 0x54400004 # bnel $v0, $zero, 0x802D7574
/* 0x00267964 0x802D7564 0x2463FFFF */ .word 0x2463FFFF # addiu $v1, $v1, -0x1
/* 0x00267968 0x802D7568 0x08084B60 */ .word 0x08084B60 # j 0x80212D80
/* 0x0026796C 0x802D756C 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00267970 0x802D7570 0x2463FFFF */ .word 0x2463FFFF # addiu $v1, $v1, -0x1
/* 0x00267974 0x802D7574 0x00031027 */ .word 0x00031027 # nor $v0, $zero, $v1
/* 0x00267978 0x802D7578 0x000217C3 */ .word 0x000217C3 # sra $v0, $v0, 31
/* 0x0026797C 0x802D757C 0x00621824 */ .word 0x00621824 # and $v1, $v1, $v0
/* 0x00267980 0x802D7580 0x00031080 */ .word 0x00031080 # sll $v0, $v1, 2
/* 0x00267984 0x802D7584 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00267988 0x802D7588 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026798C 0x802D758C 0x84420002 */ .word 0x84420002 # lh $v0, 0x2($v0)
/* 0x00267990 0x802D7590 0x44852000 */ .word 0x44852000 # mtc1 $a1, $f4
