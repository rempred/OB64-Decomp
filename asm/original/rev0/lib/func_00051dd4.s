/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x00051DD4..0x00051E10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* addiu $sp,-0x18 prologue; loop of jal 0x8017F3C0/0x8017C2FC; jr $ra at 0x51E08 + delay 0x51E0C. Ends where next preamble begins. */
/* function boundary candidate: func_00051DD4, size=60, kind=prologue */
func_00051DD4:
/* 0x00051DD4 0x800C19D4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00051DD8 0x800C19D8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00051DDC 0x800C19DC 0x0C05FCF0 */ .word 0x0C05FCF0 # jal 0x8017F3C0
/* 0x00051DE0 0x800C19E0 0x00000000 */ .word 0x00000000 # nop
/* 0x00051DE4 0x800C19E4 0x10400007 */ .word 0x10400007 # beq $v0, $zero, 0x800C1A04
/* 0x00051DE8 0x800C19E8 0x00000000 */ .word 0x00000000 # nop
/* 0x00051DEC 0x800C19EC 0x0C05F0BF */ .word 0x0C05F0BF # jal 0x8017C2FC
/* 0x00051DF0 0x800C19F0 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x00051DF4 0x800C19F4 0x0C05FCF0 */ .word 0x0C05FCF0 # jal 0x8017F3C0
/* 0x00051DF8 0x800C19F8 0x00000000 */ .word 0x00000000 # nop
/* 0x00051DFC 0x800C19FC 0x1440FFFB */ .word 0x1440FFFB # bne $v0, $zero, 0x800C19EC
/* 0x00051E00 0x800C1A00 0x00000000 */ .word 0x00000000 # nop
/* 0x00051E04 0x800C1A04 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00051E08 0x800C1A08 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00051E0C 0x800C1A0C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
