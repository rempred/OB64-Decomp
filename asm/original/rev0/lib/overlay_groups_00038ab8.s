/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/lib/table_text_vm_jump_table.s
 * z64 range: 0x00038AB8..0x00038AFC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): word-aligned overlay group records with terminated descriptor-ID membership. */
/* 0x00038AB8 0x800A86B8 0x0201FF00 */ .word 0x0201FF00 # sll $ra, $at, 28
/* 0x00038ABC 0x800A86BC 0x02030708 */ .word 0x02030708 # jr $s0
/* 0x00038AC0 0x800A86C0 0x09FF0000 */ .word 0x09FF0000 # j 0x87FC0000
/* 0x00038AC4 0x800A86C4 0x02040A0B */ .word 0x02040A0B # special_0x0B
/* 0x00038AC8 0x800A86C8 0x0C0D0EFF */ .word 0x0C0D0EFF # jal 0x80343BFC
/* 0x00038ACC 0x800A86CC 0x000EFF00 */ .word 0x000EFF00 # sll $ra, $t6, 28
/* 0x00038AD0 0x800A86D0 0x020306FF */ .word 0x020306FF # dsra32 $zero, $v1, 27
/* 0x00038AD4 0x800A86D4 0x0FFF0000 */ .word 0x0FFF0000 # jal 0x8FFC0000
/* 0x00038AD8 0x800A86D8 0x00010207 */ .word 0x00010207 # srav $zero, $at, $zero
/* 0x00038ADC 0x800A86DC 0x08090A0B */ .word 0x08090A0B # j 0x8024282C
/* 0x00038AE0 0x800A86E0 0x0C0D0EFF */ .word 0x0C0D0EFF # jal 0x80343BFC
/* 0x00038AE4 0x800A86E4 0x02040A0B */ .word 0x02040A0B # special_0x0B
/* 0x00038AE8 0x800A86E8 0x0C0D10FF */ .word 0x0C0D10FF # jal 0x803443FC
/* 0x00038AEC 0x800A86EC 0x1112FF00 */ .word 0x1112FF00 # beq $t0, $s2, 0x800A82F0
/* 0x00038AF0 0x800A86F0 0x02030708 */ .word 0x02030708 # jr $s0
/* 0x00038AF4 0x800A86F4 0x0912FF00 */ .word 0x0912FF00 # j 0x844BFC00
/* 0x00038AF8 0x800A86F8 0x020112FF */ .word 0x020112FF # dsra32 $v0, $at, 11
