/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024BECC..0x0024BF04 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf. addiu -0x2F; bgez; sra/sub/sll scale chain; jr$ra@0x0024BEFC + delay addiu $v0,$v0,-0x39@0x0024BF00. Reads $a0. */
/* 0x0024BECC 0x802BBACC 0x2482FFD1 */ .word 0x2482FFD1 # addiu $v0, $a0, -0x2F
/* 0x0024BED0 0x802BBAD0 0x04410002 */ .word 0x04410002 # bgez $v0, 0x802BBADC
/* 0x0024BED4 0x802BBAD4 0x00401821 */ .word 0x00401821 # move $v1, $v0
/* 0x0024BED8 0x802BBAD8 0x2483FFD4 */ .word 0x2483FFD4 # addiu $v1, $a0, -0x2C
/* 0x0024BEDC 0x802BBADC 0x00031883 */ .word 0x00031883 # sra $v1, $v1, 2
/* 0x0024BEE0 0x802BBAE0 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x0024BEE4 0x802BBAE4 0x00431823 */ .word 0x00431823 # subu $v1, $v0, $v1
/* 0x0024BEE8 0x802BBAE8 0x00031080 */ .word 0x00031080 # sll $v0, $v1, 2
/* 0x0024BEEC 0x802BBAEC 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0024BEF0 0x802BBAF0 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x0024BEF4 0x802BBAF4 0x00431023 */ .word 0x00431023 # subu $v0, $v0, $v1
/* 0x0024BEF8 0x802BBAF8 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x0024BEFC 0x802BBAFC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024BF00 0x802BBB00 0x2442FFC7 */ .word 0x2442FFC7 # addiu $v0, $v0, -0x39
