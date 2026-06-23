/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DCB78..0x000DCB88 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): HYPOTHESIS: 4-word marker/separator interlude (0x582B6831,0x33350000,0x400921FA,0xFC8B007A). Last two words are the recurring pi-double (0x400921FA/0xFC8B007A) acting as a table separator/sentinel between pointer groups.. */
/* 0x000DCB78 0x8014C778 0x582B6831 */ .word 0x582B6831 # blezl $at, 0x80166840
/* 0x000DCB7C 0x8014C77C 0x33350000 */ .word 0x33350000 # andi $s5, $t9, 0x0000
/* 0x000DCB80 0x8014C780 0x400921FA */ .word 0x400921FA # mfc0 $t1, $4
/* 0x000DCB84 0x8014C784 0xFC8B007A */ .word 0xFC8B007A # sd $t3, 0x7A($a0)
