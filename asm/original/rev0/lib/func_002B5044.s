/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B5044..0x002B506C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf struct-builder (over-merge in plan idx32). Writes 0x36/0x34 and args into $a0 struct from caller stack arg 0x12($sp). jr $ra at 0x5064 + delay 0x5068. Ends before forward preamble 0x506C/0x5070. */
func_002B5044:
/* 0x002B5044 0x80324C44 0x97A30012 */ .word 0x97A30012 # lhu $v1, 0x12($sp)
/* 0x002B5048 0x80324C48 0x24020036 */ .word 0x24020036 # addiu $v0, $zero, 0x36
/* 0x002B504C 0x80324C4C 0xA0820000 */ .word 0xA0820000 # sb $v0, 0x0($a0)
/* 0x002B5050 0x80324C50 0x24020034 */ .word 0x24020034 # addiu $v0, $zero, 0x34
/* 0x002B5054 0x80324C54 0xA0820001 */ .word 0xA0820001 # sb $v0, 0x1($a0)
/* 0x002B5058 0x80324C58 0xA0850002 */ .word 0xA0850002 # sb $a1, 0x2($a0)
/* 0x002B505C 0x80324C5C 0xA0860003 */ .word 0xA0860003 # sb $a2, 0x3($a0)
/* 0x002B5060 0x80324C60 0xA4870004 */ .word 0xA4870004 # sh $a3, 0x4($a0)
/* 0x002B5064 0x80324C64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B5068 0x80324C68 0xA4830006 */ .word 0xA4830006 # sh $v1, 0x6($a0)
