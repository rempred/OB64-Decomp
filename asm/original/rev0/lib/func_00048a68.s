/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00048A68..0x00048ABC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, andi $a0,$a0,0xFF bit-field accessor; jr $ra at 0x00048AB4 + delay slot sb 0x00048AB8. Un-merged from parent idx57. */
func_00048a68:
/* 0x00048A68 0x800B8668 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00048A6C 0x800B866C 0x2486FFFF */ .word 0x2486FFFF # addiu $a2, $a0, -0x1
/* 0x00048A70 0x800B8670 0x04C10002 */ .word 0x04C10002 # bgez $a2, 0x800B867C
/* 0x00048A74 0x800B8674 0x00C01021 */ .word 0x00C01021 # move $v0, $a2
/* 0x00048A78 0x800B8678 0x24820006 */ .word 0x24820006 # addiu $v0, $a0, 0x6
/* 0x00048A7C 0x800B867C 0x000238C3 */ .word 0x000238C3 # sra $a3, $v0, 3
/* 0x00048A80 0x800B8680 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00048A84 0x800B8684 0x00671821 */ .word 0x00671821 # addu $v1, $v1, $a3
/* 0x00048A88 0x800B8688 0x90636A81 */ .word 0x90636A81 # lbu $v1, 0x6A81($v1)
/* 0x00048A8C 0x800B868C 0x30C40007 */ .word 0x30C40007 # andi $a0, $a2, 0x0007
/* 0x00048A90 0x800B8690 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00048A94 0x800B8694 0x00821004 */ .word 0x00821004 # sllv $v0, $v0, $a0
/* 0x00048A98 0x800B8698 0x00021027 */ .word 0x00021027 # nor $v0, $zero, $v0
/* 0x00048A9C 0x800B869C 0x00621824 */ .word 0x00621824 # and $v1, $v1, $v0
/* 0x00048AA0 0x800B86A0 0x30A200FF */ .word 0x30A200FF # andi $v0, $a1, 0x00FF
/* 0x00048AA4 0x800B86A4 0x00821004 */ .word 0x00821004 # sllv $v0, $v0, $a0
/* 0x00048AA8 0x800B86A8 0x00621025 */ .word 0x00621025 # or $v0, $v1, $v0
/* 0x00048AAC 0x800B86AC 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00048AB0 0x800B86B0 0x00270821 */ .word 0x00270821 # addu $at, $at, $a3
/* 0x00048AB4 0x800B86B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00048AB8 0x800B86B8 0xA0226A81 */ .word 0xA0226A81 # sb $v0, 0x6A81($at)
