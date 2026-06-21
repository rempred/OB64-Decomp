/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002DE10..0x0002DE50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002DE10 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
mod_s64_tail:
/* function boundary candidate: func_0002DE10, size=36, kind=leaf */
func_0002DE10:
/* 0x0002DE10 0x8009DA10 0x14C00008 */ .word 0x14C00008 # bne $a2, $zero, 0x8009DA34
/* 0x0002DE14 0x8009DA14 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DE18 0x8009DA18 0x03E06821 */ .word 0x03E06821 # move $t5, $ra
/* 0x0002DE1C 0x8009DA1C 0x0C0275ED */ .word 0x0C0275ED # jal 0x8009D7B4
/* 0x0002DE20 0x8009DA20 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DE24 0x8009DA24 0x01A0F821 */ .word 0x01A0F821 # move $ra, $t5
/* 0x0002DE28 0x8009DA28 0x01201821 */ .word 0x01201821 # move $v1, $t1
/* 0x0002DE2C 0x8009DA2C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002DE30 0x8009DA30 0x00421026 */ .word 0x00421026 # xor $v0, $v0, $v0
/* 0x0002DE34 0x8009DA34 0x03E06821 */ .word 0x03E06821 # move $t5, $ra
/* 0x0002DE38 0x8009DA38 0x0C0275AE */ .word 0x0C0275AE # jal 0x8009D6B8
/* 0x0002DE3C 0x8009DA3C 0x00000000 */ .word 0x00000000 # nop
/* 0x0002DE40 0x8009DA40 0x01A0F821 */ .word 0x01A0F821 # move $ra, $t5
/* 0x0002DE44 0x8009DA44 0x00A01821 */ .word 0x00A01821 # move $v1, $a1
/* 0x0002DE48 0x8009DA48 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002DE4C 0x8009DA4C 0x00801021 */ .word 0x00801021 # move $v0, $a0
