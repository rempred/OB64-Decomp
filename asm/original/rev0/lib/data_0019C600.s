/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x0019C600..0x0019C620 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Anomalous 8-word block embedded between pointer tables: 0x40185555, 0x55555555, 0x40185555, 0x55555555, 0x10760000, 0x20000000, 0x25730000, 0x00000000. The 0x40185555/0x55555555 repetition is a recognizable uninitialized/filler pattern; remaining words are not valid 0x8016/0x802x RAM pointers. Treated as raw data; trailing zero word folded in.. */
/* 0x0019C600 0x8020C200 0x40185555 */ .word 0x40185555 # mfc0 $t8, $10
/* 0x0019C604 0x8020C204 0x55555555 */ .word 0x55555555 # bnel $t2, $s5, 0x8022175C
/* 0x0019C608 0x8020C208 0x40185555 */ .word 0x40185555 # mfc0 $t8, $10
/* 0x0019C60C 0x8020C20C 0x55555555 */ .word 0x55555555 # bnel $t2, $s5, 0x80221764
/* 0x0019C610 0x8020C210 0x10760000 */ .word 0x10760000 # beq $v1, $s6, 0x8020C214
/* 0x0019C614 0x8020C214 0x20000000 */ .word 0x20000000 # addi $zero, $zero, 0x0
/* 0x0019C618 0x8020C218 0x25730000 */ .word 0x25730000 # addiu $s3, $t3, 0x0
/* 0x0019C61C 0x8020C21C 0x00000000 */ .word 0x00000000 # nop
