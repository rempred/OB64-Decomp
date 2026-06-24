/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00421000_00431000.s
 * z64 range: 0x00429AB4..0x00429AC4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small inter-padding marker/field (16 B) between the two padding blocks (contains a short non-zero run 0x429AB7..0x429AC1). raw-but-classified; exact field semantics unresolved (field_0x00).. */
/* 0x00429AB4 0x804996B4 0x000000EE */ .word 0x000000EE # dsub $zero, $zero, $zero
/* 0x00429AB8 0x804996B8 0xEE000000 */ .word 0xEE000000 # op_0x3B
/* 0x00429ABC 0x804996BC 0x00000000 */ .word 0x00000000 # nop
/* 0x00429AC0 0x804996C0 0x0A000000 */ .word 0x0A000000 # j 0x88000000
