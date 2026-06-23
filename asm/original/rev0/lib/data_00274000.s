/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00274000..0x0027401C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed header: 0x050E1720, 0x29323B05, two zero words, then small index values 0x00010000 / 0x00020000. Mixed scalar/index, cannot fully type.. */
/* 0x00274000 0x802E3C00 0x050E1720 */ .word 0x050E1720 # tnei $t0, 0x1720
/* 0x00274004 0x802E3C04 0x29323B05 */ .word 0x29323B05 # slti $s2, $t1, 0x3B05
/* 0x00274008 0x802E3C08 0x00000000 */ .word 0x00000000 # nop
/* 0x0027400C 0x802E3C0C 0x00000000 */ .word 0x00000000 # nop
/* 0x00274010 0x802E3C10 0x00000000 */ .word 0x00000000 # nop
/* 0x00274014 0x802E3C14 0x00010000 */ .word 0x00010000 # sll $zero, $at, 0
/* 0x00274018 0x802E3C18 0x00020000 */ .word 0x00020000 # sll $zero, $v0, 0
