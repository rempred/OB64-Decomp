/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x0017F9C0..0x0017FA04 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Start-of-region-3 preamble-orphan: lui $v0,0x8021 / lbu $v0,0x4A68($v0) at 0x17F9C0-0x17F9C4 is a read-before-write preamble feeding bne $v0,$zero at 0x17F9CC, which is part of the addiu $sp,-0x18 prologue at 0x17F9C8. Folded forward; own label func_0017F9C0, not the inner func_0017F9C8. Init/once-guard: bumps the 0x8021:0x4A68 byte counter, clears 0x8022:E120, calls jal 0x80214FC4. Ends jr $ra (0x17F9FC) + delay addiu $sp,0x18 (0x17FA00). */
func_0017F9C0:
/* 0x0017F9C0 0x801EF5C0 0x3C028021 */ .word 0x3C028021 # lui $v0, 0x8021
/* 0x0017F9C4 0x801EF5C4 0x90424A68 */ .word 0x90424A68 # lbu $v0, 0x4A68($v0)

/* function boundary candidate: func_0017F9C8, size=60, kind=prologue */
func_0017F9C8:
/* 0x0017F9C8 0x801EF5C8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0017F9CC 0x801EF5CC 0x1440000A */ .word 0x1440000A # bne $v0, $zero, 0x801EF5F8
/* 0x0017F9D0 0x801EF5D0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0017F9D4 0x801EF5D4 0x0C0853F1 */ .word 0x0C0853F1 # jal 0x80214FC4
/* 0x0017F9D8 0x801EF5D8 0x00000000 */ .word 0x00000000 # nop
/* 0x0017F9DC 0x801EF5DC 0x3C028021 */ .word 0x3C028021 # lui $v0, 0x8021
/* 0x0017F9E0 0x801EF5E0 0x90424A68 */ .word 0x90424A68 # lbu $v0, 0x4A68($v0)
/* 0x0017F9E4 0x801EF5E4 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0017F9E8 0x801EF5E8 0xA020E120 */ .word 0xA020E120 # sb $zero, -0x1EE0($at)
/* 0x0017F9EC 0x801EF5EC 0x24420001 */ .word 0x24420001 # addiu $v0, $v0, 0x1
/* 0x0017F9F0 0x801EF5F0 0x3C018021 */ .word 0x3C018021 # lui $at, 0x8021
/* 0x0017F9F4 0x801EF5F4 0xA0224A68 */ .word 0xA0224A68 # sb $v0, 0x4A68($at)
/* 0x0017F9F8 0x801EF5F8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0017F9FC 0x801EF5FC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0017FA00 0x801EF600 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
