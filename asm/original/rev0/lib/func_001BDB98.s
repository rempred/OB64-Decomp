/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BDB98..0x001BDBBC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Short prologue function (-0x18). Calls 'jal 0x80093380' (memset/clear, a0=base 0x8023A2E8, a1=0x1D8 size) then returns. jr$ra@0x1BDBB4 + delay 'addiu $sp,0x18'@0x1BDBB8. */
func_001BDB98:
/* function boundary candidate: func_001BDB98, size=36, kind=prologue */
func_001BDB98:
/* 0x001BDB98 0x8022D798 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001BDB9C 0x8022D79C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001BDBA0 0x8022D7A0 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x001BDBA4 0x8022D7A4 0x2484A2E8 */ .word 0x2484A2E8 # addiu $a0, $a0, -0x5D18
/* 0x001BDBA8 0x8022D7A8 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x001BDBAC 0x8022D7AC 0x240501D8 */ .word 0x240501D8 # addiu $a1, $zero, 0x1D8
/* 0x001BDBB0 0x8022D7B0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001BDBB4 0x8022D7B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BDBB8 0x8022D7B8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
