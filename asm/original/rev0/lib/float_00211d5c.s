/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00211D5C..0x00211D7C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE-754 float32 constant pool: 0x42A4C72B=82.39f, 0x42268A3D=41.635f, 0x42207CEE=40.122f, 0xBFC00000=-1.5f, 0x00000000=0.0f, 0xBFA28F5C=-1.27f, 0x3DCCCCCD=0.1f, 0x414E147B=12.88f.. */
/* 0x00211D5C 0x8028195C 0x42A4C72B */ .word 0x42A4C72B # cop0_0x15
/* 0x00211D60 0x80281960 0x42268A3D */ .word 0x42268A3D # cop0_0x11
/* 0x00211D64 0x80281964 0x42207CEE */ .word 0x42207CEE # cop0_0x11
/* 0x00211D68 0x80281968 0xBFC00000 */ .word 0xBFC00000 # cache 0x00, 0x0($s8)
/* 0x00211D6C 0x8028196C 0x00000000 */ .word 0x00000000 # nop
/* 0x00211D70 0x80281970 0xBFA28F5C */ .word 0xBFA28F5C # cache 0x02, -0x70A4($sp)
/* 0x00211D74 0x80281974 0x3DCCCCCD */ .word 0x3DCCCCCD # lui $t4, 0xCCCD
/* 0x00211D78 0x80281978 0x414E147B */ .word 0x414E147B # cop0_0x0A
