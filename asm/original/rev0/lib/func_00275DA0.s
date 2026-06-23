/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275DA0..0x00275DBC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf FP convert: mtc1 $a1,$f0; trunc.w.s; mfc1 $v0,$f0. Ends jr$ra@0x275DB4 + delay sh$v0,0x28($a0)@0x275DB8 (delay slot stays). */
/* 0x00275DA0 0x802E59A0 0x44850000 */ .word 0x44850000 # mtc1 $a1, $f0
/* 0x00275DA4 0x802E59A4 0x00000000 */ .word 0x00000000 # nop
/* 0x00275DA8 0x802E59A8 0x4600000D */ .word 0x4600000D # trunc.w.s $f0, $f0
/* 0x00275DAC 0x802E59AC 0x44020000 */ .word 0x44020000 # mfc1 $v0, $f0
/* 0x00275DB0 0x802E59B0 0x00000000 */ .word 0x00000000 # nop
/* 0x00275DB4 0x802E59B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00275DB8 0x802E59B8 0xA4820028 */ .word 0xA4820028 # sh $v0, 0x28($a0)
