/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x0028A9DC..0x0028AA4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf arithmetic compare. jr $ra @0x0028AA44 +delay (slt) @0x0028AA48. */
/* 0x0028A9DC 0x802FA5DC 0x90830004 */ .word 0x90830004 # lbu $v1, 0x4($a0)
/* 0x0028A9E0 0x802FA5E0 0x90860005 */ .word 0x90860005 # lbu $a2, 0x5($a0)
/* 0x0028A9E4 0x802FA5E4 0x00031100 */ .word 0x00031100 # sll $v0, $v1, 4
/* 0x0028A9E8 0x802FA5E8 0x00431023 */ .word 0x00431023 # subu $v0, $v0, $v1
/* 0x0028A9EC 0x802FA5EC 0x94830002 */ .word 0x94830002 # lhu $v1, 0x2($a0)
/* 0x0028A9F0 0x802FA5F0 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x0028A9F4 0x802FA5F4 0x00C23021 */ .word 0x00C23021 # addu $a2, $a2, $v0
/* 0x0028A9F8 0x802FA5F8 0x90A40004 */ .word 0x90A40004 # lbu $a0, 0x4($a1)
/* 0x0028A9FC 0x802FA5FC 0x00031080 */ .word 0x00031080 # sll $v0, $v1, 2
/* 0x0028AA00 0x802FA600 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0028AA04 0x802FA604 0x00021900 */ .word 0x00021900 # sll $v1, $v0, 4
/* 0x0028AA08 0x802FA608 0x00621823 */ .word 0x00621823 # subu $v1, $v1, $v0
/* 0x0028AA0C 0x802FA60C 0x000318C0 */ .word 0x000318C0 # sll $v1, $v1, 3
/* 0x0028AA10 0x802FA610 0x00C33021 */ .word 0x00C33021 # addu $a2, $a2, $v1
/* 0x0028AA14 0x802FA614 0x90A20005 */ .word 0x90A20005 # lbu $v0, 0x5($a1)
/* 0x0028AA18 0x802FA618 0x00041900 */ .word 0x00041900 # sll $v1, $a0, 4
/* 0x0028AA1C 0x802FA61C 0x00641823 */ .word 0x00641823 # subu $v1, $v1, $a0
/* 0x0028AA20 0x802FA620 0x94A50002 */ .word 0x94A50002 # lhu $a1, 0x2($a1)
/* 0x0028AA24 0x802FA624 0x00031840 */ .word 0x00031840 # sll $v1, $v1, 1
/* 0x0028AA28 0x802FA628 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0028AA2C 0x802FA62C 0x00052080 */ .word 0x00052080 # sll $a0, $a1, 2
/* 0x0028AA30 0x802FA630 0x00852021 */ .word 0x00852021 # addu $a0, $a0, $a1
/* 0x0028AA34 0x802FA634 0x00041900 */ .word 0x00041900 # sll $v1, $a0, 4
/* 0x0028AA38 0x802FA638 0x00641823 */ .word 0x00641823 # subu $v1, $v1, $a0
/* 0x0028AA3C 0x802FA63C 0x000318C0 */ .word 0x000318C0 # sll $v1, $v1, 3
/* 0x0028AA40 0x802FA640 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0028AA44 0x802FA644 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0028AA48 0x802FA648 0x0046102A */ .word 0x0046102A # slt $v0, $v0, $a2
