/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/lib/func_00040f88_chunk3head.s
 * z64 range: 0x00040F88..0x00040FF4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* func_00040F88 [0x40F88,0x40FF4): complete frameless-prologue leaf (returns jr $ra at 0x40FEC, epilogue addiu $sp,$sp,8 at 0x40FF0). The parent DB over-merged this with the next function into one size=272 record; the in-body 'size=272' boundary-candidate comment reflects that over-merge, not this 108-byte function. */
/* function boundary candidate: func_00040F88, size=272, kind=prologue */
func_00040F88:
/* 0x00040F88 0x800B0B88 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00040F8C 0x800B0B8C 0x93A2001B */ .word 0x93A2001B # lbu $v0, 0x1B($sp)
/* 0x00040F90 0x800B0B90 0x00004021 */ .word 0x00004021 # move $t0, $zero
/* 0x00040F94 0x800B0B94 0xA3A40000 */ .word 0xA3A40000 # sb $a0, 0x0($sp)
/* 0x00040F98 0x800B0B98 0xA3A50001 */ .word 0xA3A50001 # sb $a1, 0x1($sp)
/* 0x00040F9C 0x800B0B9C 0xA3A60002 */ .word 0xA3A60002 # sb $a2, 0x2($sp)
/* 0x00040FA0 0x800B0BA0 0xA3A70003 */ .word 0xA3A70003 # sb $a3, 0x3($sp)
/* 0x00040FA4 0x800B0BA4 0xA3A20004 */ .word 0xA3A20004 # sb $v0, 0x4($sp)
/* 0x00040FA8 0x800B0BA8 0x03A02021 */ .word 0x03A02021 # move $a0, $sp
/* 0x00040FAC 0x800B0BAC 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00040FB0 0x800B0BB0 0x3C058018 */ .word 0x3C058018 # lui $a1, 0x8018
/* 0x00040FB4 0x800B0BB4 0x00A82821 */ .word 0x00A82821 # addu $a1, $a1, $t0
/* 0x00040FB8 0x800B0BB8 0x90A56FBC */ .word 0x90A56FBC # lbu $a1, 0x6FBC($a1)
/* 0x00040FBC 0x800B0BBC 0x90820000 */ .word 0x90820000 # lbu $v0, 0x0($a0)
/* 0x00040FC0 0x800B0BC0 0x1045000A */ .word 0x1045000A # beq $v0, $a1, 0x800B0BEC
/* 0x00040FC4 0x800B0BC4 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x00040FC8 0x800B0BC8 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00040FCC 0x800B0BCC 0x28620005 */ .word 0x28620005 # slti $v0, $v1, 0x5
/* 0x00040FD0 0x800B0BD0 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x800B0BBC
/* 0x00040FD4 0x800B0BD4 0x00000000 */ .word 0x00000000 # nop
/* 0x00040FD8 0x800B0BD8 0x25080001 */ .word 0x25080001 # addiu $t0, $t0, 0x1
/* 0x00040FDC 0x800B0BDC 0x2D020007 */ .word 0x2D020007 # sltiu $v0, $t0, 0x7
/* 0x00040FE0 0x800B0BE0 0x5440FFF2 */ .word 0x5440FFF2 # bnel $v0, $zero, 0x800B0BAC
/* 0x00040FE4 0x800B0BE4 0x03A02021 */ .word 0x03A02021 # move $a0, $sp
/* 0x00040FE8 0x800B0BE8 0x24020007 */ .word 0x24020007 # addiu $v0, $zero, 0x7
/* 0x00040FEC 0x800B0BEC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00040FF0 0x800B0BF0 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
