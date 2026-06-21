/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001703C..0x00017090 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001703C, size=72, kind=leaf */
func_0001703C:
/* 0x0001703C 0x80086C3C 0x000528C3 */ .word 0x000528C3 # sra $a1, $a1, 3
/* 0x00017040 0x80086C40 0x10A0000D */ .word 0x10A0000D # beq $a1, $zero, 0x80086C78
/* 0x00017044 0x80086C44 0x00061C00 */ .word 0x00061C00 # sll $v1, $a2, 16
/* 0x00017048 0x80086C48 0x30E2FFFF */ .word 0x30E2FFFF # andi $v0, $a3, 0xFFFF
/* 0x0001704C 0x80086C4C 0x00450018 */ .word 0x00450018 # mult $v0, $a1
/* 0x00017050 0x80086C50 0x00001012 */ .word 0x00001012 # mflo $v0
/* 0x00017054 0x80086C54 0x00031C03 */ .word 0x00031C03 # sra $v1, $v1, 16
/* 0x00017058 0x80086C58 0x00000000 */ .word 0x00000000 # nop
/* 0x0001705C 0x80086C5C 0x00650018 */ .word 0x00650018 # mult $v1, $a1
/* 0x00017060 0x80086C60 0x00001812 */ .word 0x00001812 # mflo $v1
/* 0x00017064 0x80086C64 0x00021403 */ .word 0x00021403 # sra $v0, $v0, 16
/* 0x00017068 0x80086C68 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0001706C 0x80086C6C 0x00821021 */ .word 0x00821021 # addu $v0, $a0, $v0
/* 0x00017070 0x80086C70 0x08021B1F */ .word 0x08021B1F # j 0x80086C7C
/* 0x00017074 0x80086C74 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x00017078 0x80086C78 0x00041400 */ .word 0x00041400 # sll $v0, $a0, 16
/* 0x0001707C 0x80086C7C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00017080 0x80086C80 0x00021403 */ .word 0x00021403 # sra $v0, $v0, 16
/* 0x00017084 0x80086C84 0x00000000 */ .word 0x00000000 # nop
/* 0x00017088 0x80086C88 0x00000000 */ .word 0x00000000 # nop
/* 0x0001708C 0x80086C8C 0x00000000 */ .word 0x00000000 # nop
