/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00027574..0x000275B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00027574 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00027574:
/* 0x00027574 0x80097174 0x2487001C */ .word 0x2487001C # addiu $a3, $a0, 0x1C
/* 0x00027578 0x80097178 0xA4C00000 */ .word 0xA4C00000 # sh $zero, 0x0($a2)
/* 0x0002757C 0x8009717C 0xA4A00000 */ .word 0xA4A00000 # sh $zero, 0x0($a1)
/* 0x00027580 0x80097180 0x94830000 */ .word 0x94830000 # lhu $v1, 0x0($a0)
/* 0x00027584 0x80097184 0x94A20000 */ .word 0x94A20000 # lhu $v0, 0x0($a1)
/* 0x00027588 0x80097188 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0002758C 0x8009718C 0xA4A20000 */ .word 0xA4A20000 # sh $v0, 0x0($a1)
/* 0x00027590 0x80097190 0x94C20000 */ .word 0x94C20000 # lhu $v0, 0x0($a2)
/* 0x00027594 0x80097194 0x24840002 */ .word 0x24840002 # addiu $a0, $a0, 0x2
/* 0x00027598 0x80097198 0x00031827 */ .word 0x00031827 # nor $v1, $zero, $v1
/* 0x0002759C 0x8009719C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000275A0 0x800971A0 0xA4C20000 */ .word 0xA4C20000 # sh $v0, 0x0($a2)
/* 0x000275A4 0x800971A4 0x0087102B */ .word 0x0087102B # sltu $v0, $a0, $a3
/* 0x000275A8 0x800971A8 0x1440FFF5 */ .word 0x1440FFF5 # bne $v0, $zero, 0x80097180
/* 0x000275AC 0x800971AC 0x00000000 */ .word 0x00000000 # nop
/* 0x000275B0 0x800971B0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000275B4 0x800971B4 0x00001021 */ .word 0x00001021 # move $v0, $zero
