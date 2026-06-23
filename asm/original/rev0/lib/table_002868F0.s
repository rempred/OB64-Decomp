/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002868F0..0x00286920 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed u16 index/offset pairs (0x0254,0x0255,0x0556,0x0557,0x045E,0x025F,... ascending 16-bit values) terminated by 0xFFFF0000 sentinel @0x0028691C. Value type: 16-bit indices.. */
/* 0x002868F0 0x802F64F0 0x02540255 */ .word 0x02540255 # special_0x15
/* 0x002868F4 0x802F64F4 0x05560557 */ .word 0x05560557 # regimm_0x16 $t2, 0x802F7A54
/* 0x002868F8 0x802F64F8 0x045E025F */ .word 0x045E025F # regimm_0x1E $v0, 0x802F6E78
/* 0x002868FC 0x802F64FC 0x02600161 */ .word 0x02600161 # move $zero, $s3
/* 0x00286900 0x802F6500 0x01580059 */ .word 0x01580059 # multu $t2, $t8
/* 0x00286904 0x802F6504 0x025A035B */ .word 0x025A035B # divu $s2, $k0
/* 0x00286908 0x802F6508 0x005C025D */ .word 0x005C025D # dmultu $v0, $gp
/* 0x0028690C 0x802F650C 0x01750176 */ .word 0x01750176 # tne $t3, $s5
/* 0x00286910 0x802F6510 0x03770578 */ .word 0x03770578 # dsll $zero, $s7, 21
/* 0x00286914 0x802F6514 0x0179047A */ .word 0x0179047A # dsrl $zero, $t9, 17
/* 0x00286918 0x802F6518 0x007B017C */ .word 0x007B017C # dsll32 $zero, $k1, 5
/* 0x0028691C 0x802F651C 0xFFFF0000 */ .word 0xFFFF0000 # sd $ra, 0x0($ra)
