/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024E408..0x0024E430 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame -0x18. Tiny: jal 0x802174C0 with andi $a0,0xFFFF, sets bit 0x8000 in halfword at 0xA. jr $ra at 0x0024E428 + delay addiu $sp,0x18. Ends before prologue 0x0024E430. */
/* function boundary candidate: func_0024E408, size=40, kind=prologue */
func_0024E408:
/* 0x0024E408 0x802BE008 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0024E40C 0x802BE00C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0024E410 0x802BE010 0x0C085D30 */ .word 0x0C085D30 # jal 0x802174C0
/* 0x0024E414 0x802BE014 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x0024E418 0x802BE018 0x9443000A */ .word 0x9443000A # lhu $v1, 0xA($v0)
/* 0x0024E41C 0x802BE01C 0x34638000 */ .word 0x34638000 # ori $v1, $v1, 0x8000
/* 0x0024E420 0x802BE020 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0024E424 0x802BE024 0xA443000A */ .word 0xA443000A # sh $v1, 0xA($v0)
/* 0x0024E428 0x802BE028 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024E42C 0x802BE02C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
