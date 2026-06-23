/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001466E4..0x00146730 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* addiu $sp,-0x8 prologue; lwl/lwr/swl/swr unaligned copy of 6 bytes from 0x801FD958 onto stack, clamps $a0<3, indexes halfword and stores to -0x25A0. jr $ra at 0x00146728 + delay 0x0014672C. */
/* function boundary candidate: func_001466E4, size=76, kind=prologue */
func_001466E4:
/* 0x001466E4 0x801B62E4 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x001466E8 0x801B62E8 0x3C068020 */ .word 0x3C068020 # lui $a2, 0x8020
/* 0x001466EC 0x801B62EC 0x24C6D958 */ .word 0x24C6D958 # addiu $a2, $a2, -0x26A8
/* 0x001466F0 0x801B62F0 0x88C20000 */ .word 0x88C20000 # lwl $v0, 0x0($a2)
/* 0x001466F4 0x801B62F4 0x98C20003 */ .word 0x98C20003 # lwr $v0, 0x3($a2)
/* 0x001466F8 0x801B62F8 0x84C30004 */ .word 0x84C30004 # lh $v1, 0x4($a2)
/* 0x001466FC 0x801B62FC 0xABA20000 */ .word 0xABA20000 # swl $v0, 0x0($sp)
/* 0x00146700 0x801B6300 0xBBA20003 */ .word 0xBBA20003 # swr $v0, 0x3($sp)
/* 0x00146704 0x801B6304 0xA7A30004 */ .word 0xA7A30004 # sh $v1, 0x4($sp)
/* 0x00146708 0x801B6308 0x2C820003 */ .word 0x2C820003 # sltiu $v0, $a0, 0x3
/* 0x0014670C 0x801B630C 0x00021023 */ .word 0x00021023 # subu $v0, $zero, $v0
/* 0x00146710 0x801B6310 0x00822024 */ .word 0x00822024 # and $a0, $a0, $v0
/* 0x00146714 0x801B6314 0x00042040 */ .word 0x00042040 # sll $a0, $a0, 1
/* 0x00146718 0x801B6318 0x009D2021 */ .word 0x009D2021 # addu $a0, $a0, $sp
/* 0x0014671C 0x801B631C 0x94820000 */ .word 0x94820000 # lhu $v0, 0x0($a0)
/* 0x00146720 0x801B6320 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x00146724 0x801B6324 0xA422DA60 */ .word 0xA422DA60 # sh $v0, -0x25A0($at)
/* 0x00146728 0x801B6328 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0014672C 0x801B632C 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
