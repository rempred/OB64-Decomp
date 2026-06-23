/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0F90..0x001F1000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler head: this function begins here and continues into the next 64 KiB chunk. OUTGOING straddler-head. TRUE entry is a read-before-write preamble at 0x001F0F90 (lui $v1,0x801D @1F0F90; lw $v1,-0x1744 @1F0F94; lw $v0,0x56C0 @1F0F98) feeding the parent prologue addiu $sp,-0x8 @0x001F0F9C. No jr$ra before 0x001F1000; internal j 0x801ADB54; CONTINUES into chunk 31 (returns at 0x001F1024). */
/* 0x001F0F90 0x80260B90 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x001F0F94 0x80260B94 0x8C63E8BC */ .word 0x8C63E8BC # lw $v1, -0x1744($v1)
/* 0x001F0F98 0x80260B98 0x8C6256C0 */ .word 0x8C6256C0 # lw $v0, 0x56C0($v1)

/* function boundary candidate: func_001F0F9C, size=180, kind=prologue */
func_001F0F9C:
/* 0x001F0F9C 0x80260B9C 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x001F0FA0 0x80260BA0 0x1040001F */ .word 0x1040001F # beq $v0, $zero, 0x80260C20
/* 0x001F0FA4 0x80260BA4 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x001F0FA8 0x80260BA8 0x00603021 */ .word 0x00603021 # move $a2, $v1
/* 0x001F0FAC 0x80260BAC 0x00051080 */ .word 0x00051080 # sll $v0, $a1, 2
/* 0x001F0FB0 0x80260BB0 0x00461021 */ .word 0x00461021 # addu $v0, $v0, $a2
/* 0x001F0FB4 0x80260BB4 0x8C4252C0 */ .word 0x8C4252C0 # lw $v0, 0x52C0($v0)
/* 0x001F0FB8 0x80260BB8 0x14440014 */ .word 0x14440014 # bne $v0, $a0, 0x80260C0C
/* 0x001F0FBC 0x80260BBC 0x00C03821 */ .word 0x00C03821 # move $a3, $a2
/* 0x001F0FC0 0x80260BC0 0x8CC256C0 */ .word 0x8CC256C0 # lw $v0, 0x56C0($a2)
/* 0x001F0FC4 0x80260BC4 0x0806B6D5 */ .word 0x0806B6D5 # j 0x801ADB54
/* 0x001F0FC8 0x80260BC8 0x2442FFFF */ .word 0x2442FFFF # addiu $v0, $v0, -0x1
/* 0x001F0FCC 0x80260BCC 0x00471021 */ .word 0x00471021 # addu $v0, $v0, $a3
/* 0x001F0FD0 0x80260BD0 0x8C4352C4 */ .word 0x8C4352C4 # lw $v1, 0x52C4($v0)
/* 0x001F0FD4 0x80260BD4 0xAC4352C0 */ .word 0xAC4352C0 # sw $v1, 0x52C0($v0)
/* 0x001F0FD8 0x80260BD8 0x8CE256C0 */ .word 0x8CE256C0 # lw $v0, 0x56C0($a3)
/* 0x001F0FDC 0x80260BDC 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x001F0FE0 0x80260BE0 0x2442FFFF */ .word 0x2442FFFF # addiu $v0, $v0, -0x1
/* 0x001F0FE4 0x80260BE4 0x00A2102B */ .word 0x00A2102B # sltu $v0, $a1, $v0
/* 0x001F0FE8 0x80260BE8 0x1440FFF8 */ .word 0x1440FFF8 # bne $v0, $zero, 0x80260BCC
/* 0x001F0FEC 0x80260BEC 0x00051080 */ .word 0x00051080 # sll $v0, $a1, 2
/* 0x001F0FF0 0x80260BF0 0x8CC256C0 */ .word 0x8CC256C0 # lw $v0, 0x56C0($a2)
/* 0x001F0FF4 0x80260BF4 0x2442FFFF */ .word 0x2442FFFF # addiu $v0, $v0, -0x1
/* 0x001F0FF8 0x80260BF8 0xACC256C0 */ .word 0xACC256C0 # sw $v0, 0x56C0($a2)
/* 0x001F0FFC 0x80260BFC 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
