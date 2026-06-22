/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00048AF0..0x00048B44 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, andi $a0,$a0,0xFF; jr $ra at 0x00048B3C + delay slot sb 0x00048B40. Un-merged from parent idx57. */
func_00048af0:
/* 0x00048AF0 0x800B86F0 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00048AF4 0x800B86F4 0x2486FFFF */ .word 0x2486FFFF # addiu $a2, $a0, -0x1
/* 0x00048AF8 0x800B86F8 0x04C10002 */ .word 0x04C10002 # bgez $a2, 0x800B8704
/* 0x00048AFC 0x800B86FC 0x00C01021 */ .word 0x00C01021 # move $v0, $a2
/* 0x00048B00 0x800B8700 0x24820006 */ .word 0x24820006 # addiu $v0, $a0, 0x6
/* 0x00048B04 0x800B8704 0x000238C3 */ .word 0x000238C3 # sra $a3, $v0, 3
/* 0x00048B08 0x800B8708 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00048B0C 0x800B870C 0x00671821 */ .word 0x00671821 # addu $v1, $v1, $a3
/* 0x00048B10 0x800B8710 0x90636A93 */ .word 0x90636A93 # lbu $v1, 0x6A93($v1)
/* 0x00048B14 0x800B8714 0x30C40007 */ .word 0x30C40007 # andi $a0, $a2, 0x0007
/* 0x00048B18 0x800B8718 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00048B1C 0x800B871C 0x00821004 */ .word 0x00821004 # sllv $v0, $v0, $a0
/* 0x00048B20 0x800B8720 0x00021027 */ .word 0x00021027 # nor $v0, $zero, $v0
/* 0x00048B24 0x800B8724 0x00621824 */ .word 0x00621824 # and $v1, $v1, $v0
/* 0x00048B28 0x800B8728 0x30A200FF */ .word 0x30A200FF # andi $v0, $a1, 0x00FF
/* 0x00048B2C 0x800B872C 0x00821004 */ .word 0x00821004 # sllv $v0, $v0, $a0
/* 0x00048B30 0x800B8730 0x00621025 */ .word 0x00621025 # or $v0, $v1, $v0
/* 0x00048B34 0x800B8734 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00048B38 0x800B8738 0x00270821 */ .word 0x00270821 # addu $at, $at, $a3
/* 0x00048B3C 0x800B873C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00048B40 0x800B8740 0xA0226A93 */ .word 0xA0226A93 # sb $v0, 0x6A93($at)
