/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00041638..0x00041674 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x41098: frameless leaf, entry move $v1,$zero; jr $ra at 0x4166C + delay nop */
func_00041638:
/* 0x00041638 0x800B1238 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0004163C 0x800B123C 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00041640 0x800B1240 0x3C058019 */ .word 0x3C058019 # lui $a1, 0x8019
/* 0x00041644 0x800B1244 0x24A53AC0 */ .word 0x24A53AC0 # addiu $a1, $a1, 0x3AC0
/* 0x00041648 0x800B1248 0x94A20000 */ .word 0x94A20000 # lhu $v0, 0x0($a1)
/* 0x0004164C 0x800B124C 0x54440003 */ .word 0x54440003 # bnel $v0, $a0, 0x800B125C
/* 0x00041650 0x800B1250 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00041654 0x800B1254 0x0805ADDB */ .word 0x0805ADDB # j 0x8016B76C
/* 0x00041658 0x800B1258 0x3062FFFF */ .word 0x3062FFFF # andi $v0, $v1, 0xFFFF
/* 0x0004165C 0x800B125C 0x28620028 */ .word 0x28620028 # slti $v0, $v1, 0x28
/* 0x00041660 0x800B1260 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x800B1248
/* 0x00041664 0x800B1264 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x00041668 0x800B1268 0x240201FF */ .word 0x240201FF # addiu $v0, $zero, 0x1FF
/* 0x0004166C 0x800B126C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00041670 0x800B1270 0x00000000 */ .word 0x00000000 # nop
