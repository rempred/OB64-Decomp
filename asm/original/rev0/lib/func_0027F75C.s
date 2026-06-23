/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x0027F75C..0x0027F778 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (7 words) split from plan file 27. Non-prologue fall-through entry after func_0027F3EC's delay slot: lw $v0,0x18($a0); sw $zero; lhu; sh $zero; xor $v0,$v0,$v0; ends jr $ra at 0x0027F770 + delay sh $v0,0x1E($a0) at 0x0027F774. */
/* 0x0027F75C 0x802EF35C 0x8C820018 */ .word 0x8C820018 # lw $v0, 0x18($a0)
/* 0x0027F760 0x802EF360 0xAC400000 */ .word 0xAC400000 # sw $zero, 0x0($v0)
/* 0x0027F764 0x802EF364 0x9482001E */ .word 0x9482001E # lhu $v0, 0x1E($a0)
/* 0x0027F768 0x802EF368 0xA480001C */ .word 0xA480001C # sh $zero, 0x1C($a0)
/* 0x0027F76C 0x802EF36C 0x00421026 */ .word 0x00421026 # xor $v0, $v0, $v0
/* 0x0027F770 0x802EF370 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0027F774 0x802EF374 0xA482001E */ .word 0xA482001E # sh $v0, 0x1E($a0)
