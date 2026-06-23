/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BC7E4..0x000BC828 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf (no stack frame): move $t0,$zero; nor $a0,$zero,$a0; addiu $a3,0x1872; loop clearing flags. jr $ra at 0xBC820. */
func_000bc7e4:
/* 0x000BC7E4 0x8012C3E4 0x00004021 */ .word 0x00004021 # move $t0, $zero
/* 0x000BC7E8 0x8012C3E8 0x00042027 */ .word 0x00042027 # nor $a0, $zero, $a0
/* 0x000BC7EC 0x8012C3EC 0x24071872 */ .word 0x24071872 # addiu $a3, $zero, 0x1872
/* 0x000BC7F0 0x8012C3F0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000BC7F4 0x8012C3F4 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000BC7F8 0x8012C3F8 0x00473021 */ .word 0x00473021 # addu $a2, $v0, $a3
/* 0x000BC7FC 0x8012C3FC 0x90C30000 */ .word 0x90C30000 # lbu $v1, 0x0($a2)
/* 0x000BC800 0x8012C400 0x00A31024 */ .word 0x00A31024 # and $v0, $a1, $v1
/* 0x000BC804 0x8012C404 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8012C414
/* 0x000BC808 0x8012C408 0x25080001 */ .word 0x25080001 # addiu $t0, $t0, 0x1
/* 0x000BC80C 0x8012C40C 0x00641024 */ .word 0x00641024 # and $v0, $v1, $a0
/* 0x000BC810 0x8012C410 0xA0C20000 */ .word 0xA0C20000 # sb $v0, 0x0($a2)
/* 0x000BC814 0x8012C414 0x290200DC */ .word 0x290200DC # slti $v0, $t0, 0xDC
/* 0x000BC818 0x8012C418 0x1440FFF5 */ .word 0x1440FFF5 # bne $v0, $zero, 0x8012C3F0
/* 0x000BC81C 0x8012C41C 0x24E70002 */ .word 0x24E70002 # addiu $a3, $a3, 0x2
/* 0x000BC820 0x8012C420 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BC824 0x8012C424 0x00000000 */ .word 0x00000000 # nop
