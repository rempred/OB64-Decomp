/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024BD60..0x0024BD8C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent-missed frameless divide-by-3 helper leaf. lui $v1,0x5555/ori 0x5556 reciprocal magic; andi $a0,0xFF; addiu -0x14; mult; sra 31; mfhi; jr$ra@0x0024BD84 + delay subu $v0,$a1,$v0@0x0024BD88. */
/* 0x0024BD60 0x802BB960 0x3C035555 */ .word 0x3C035555 # lui $v1, 0x5555
/* 0x0024BD64 0x802BB964 0x34635556 */ .word 0x34635556 # ori $v1, $v1, 0x5556
/* 0x0024BD68 0x802BB968 0x308200FF */ .word 0x308200FF # andi $v0, $a0, 0x00FF
/* 0x0024BD6C 0x802BB96C 0x2442FFEC */ .word 0x2442FFEC # addiu $v0, $v0, -0x14
/* 0x0024BD70 0x802BB970 0x00430018 */ .word 0x00430018 # mult $v0, $v1
/* 0x0024BD74 0x802BB974 0x000217C3 */ .word 0x000217C3 # sra $v0, $v0, 31
/* 0x0024BD78 0x802BB978 0x00002810 */ .word 0x00002810 # mfhi $a1
/* 0x0024BD7C 0x802BB97C 0x00000000 */ .word 0x00000000 # nop
/* 0x0024BD80 0x802BB980 0x00000000 */ .word 0x00000000 # nop
/* 0x0024BD84 0x802BB984 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024BD88 0x802BB988 0x00A21023 */ .word 0x00A21023 # subu $v0, $a1, $v0
