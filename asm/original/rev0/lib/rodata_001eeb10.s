/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001EEB10..0x001EEB30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII title string 'Ogre Battle 64 BGM Selection' (0x4F 0x67 0x72 0x65 ...), NUL-terminated at 0x001EEB2C and padded with 0x00000000 to 4-word boundary.. */
/* 0x001EEB10 0x8025E710 0x4F677265 */ .word 0x4F677265 # op_0x13
/* 0x001EEB14 0x8025E714 0x20426174 */ .word 0x20426174 # addi $v0, $v0, 0x6174
/* 0x001EEB18 0x8025E718 0x746C6520 */ .word 0x746C6520 # op_0x1D
/* 0x001EEB1C 0x8025E71C 0x36342042 */ .word 0x36342042 # ori $s4, $s1, 0x2042
/* 0x001EEB20 0x8025E720 0x474D2053 */ .word 0x474D2053 # cop1_0x13.fmt26
/* 0x001EEB24 0x8025E724 0x656C6563 */ .word 0x656C6563 # daddiu $t4, $t3, 0x6563
/* 0x001EEB28 0x8025E728 0x74696F6E */ .word 0x74696F6E # op_0x1D
/* 0x001EEB2C 0x8025E72C 0x00000000 */ .word 0x00000000 # nop
