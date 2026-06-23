/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026C070..0x0026C09C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame 0x18. Stores a0 to 0x80221038, jal 0x8020D778 with table ptr 0x74EC. Ends jr$ra@0x0026C094 + delay@0x0026C098. */
/* function boundary candidate: func_0026C070, size=44, kind=prologue */
func_0026C070:
/* 0x0026C070 0x802DBC70 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026C074 0x802DBC74 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026C078 0x802DBC78 0xAC241038 */ .word 0xAC241038 # sw $a0, 0x1038($at)
/* 0x0026C07C 0x802DBC7C 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0026C080 0x802DBC80 0x248474EC */ .word 0x248474EC # addiu $a0, $a0, 0x74EC
/* 0x0026C084 0x802DBC84 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026C088 0x802DBC88 0x0C0835DE */ .word 0x0C0835DE # jal 0x8020D778
/* 0x0026C08C 0x802DBC8C 0x00000000 */ .word 0x00000000 # nop
/* 0x0026C090 0x802DBC90 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026C094 0x802DBC94 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026C098 0x802DBC98 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
