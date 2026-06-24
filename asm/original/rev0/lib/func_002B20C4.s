/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B20C4..0x002B2118 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Separate FRAMELESS leaf beginning at fall-through after func_002B1F80's delay slot (addiu $v0,-1; bne $a0,$v0). Loop over a table at *(0x8022A974) writing 0x145 byte flags; internal j 0x8023D304 tail and bnel back-edge are internal. Ends jr $ra @0x002B2110 + delay nop @0x002B2114. */
func_002B20C4:
/* 0x002B20C4 0x80321CC4 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x002B20C8 0x80321CC8 0x1482000E */ .word 0x1482000E # bne $a0, $v0, 0x80321D04
/* 0x002B20CC 0x80321CCC 0x24860001 */ .word 0x24860001 # addiu $a2, $a0, 0x1
/* 0x002B20D0 0x80321CD0 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x002B20D4 0x80321CD4 0x0808F4C1 */ .word 0x0808F4C1 # j 0x8023D304
/* 0x002B20D8 0x80321CD8 0x2406001C */ .word 0x2406001C # addiu $a2, $zero, 0x1C
/* 0x002B20DC 0x80321CDC 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x002B20E0 0x80321CE0 0x8C63A974 */ .word 0x8C63A974 # lw $v1, -0x568C($v1)
/* 0x002B20E4 0x80321CE4 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x002B20E8 0x80321CE8 0x8C430018 */ .word 0x8C430018 # lw $v1, 0x18($v0)
/* 0x002B20EC 0x80321CEC 0x10600005 */ .word 0x10600005 # beq $v1, $zero, 0x80321D04
/* 0x002B20F0 0x80321CF0 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x002B20F4 0x80321CF4 0x90620145 */ .word 0x90620145 # lbu $v0, 0x145($v1)
/* 0x002B20F8 0x80321CF8 0x304200FE */ .word 0x304200FE # andi $v0, $v0, 0x00FE
/* 0x002B20FC 0x80321CFC 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x002B2100 0x80321D00 0xA0620145 */ .word 0xA0620145 # sb $v0, 0x145($v1)
/* 0x002B2104 0x80321D04 0x0086102A */ .word 0x0086102A # slt $v0, $a0, $a2
/* 0x002B2108 0x80321D08 0x5440FFF4 */ .word 0x5440FFF4 # bnel $v0, $zero, 0x80321CDC
/* 0x002B210C 0x80321D0C 0x00041080 */ .word 0x00041080 # sll $v0, $a0, 2
/* 0x002B2110 0x80321D10 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B2114 0x80321D14 0x00000000 */ .word 0x00000000 # nop
