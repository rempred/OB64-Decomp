/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026CCB4..0x0026CCF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered FRAMELESS LEAF (no prologue): entry addiu $v0,0xFF; computes 0xFF-a3 and writes results to 0x801D globals (swc1 0x6F0/0x740, sw 0x764, sh 0x820/0x71C via lui 0x801D); ends jr$ra@0026CCE0 + sh delay@0026CCE4; two trailing alignment nops (0026CCE8/0026CCEC) attached to this returning leaf. */
/* 0x0026CCB4 0x802DC8B4 0x240200FF */ .word 0x240200FF # addiu $v0, $zero, 0xFF
/* 0x0026CCB8 0x802DC8B8 0x00471023 */ .word 0x00471023 # subu $v0, $v0, $a3
/* 0x0026CCBC 0x802DC8BC 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x0026CCC0 0x802DC8C0 0xE42C06F0 */ .word 0xE42C06F0 # swc1 $f12, 0x6F0($at)
/* 0x0026CCC4 0x802DC8C4 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x0026CCC8 0x802DC8C8 0xE42E0740 */ .word 0xE42E0740 # swc1 $f14, 0x740($at)
/* 0x0026CCCC 0x802DC8CC 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x0026CCD0 0x802DC8D0 0xAC260764 */ .word 0xAC260764 # sw $a2, 0x764($at)
/* 0x0026CCD4 0x802DC8D4 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x0026CCD8 0x802DC8D8 0xA4270820 */ .word 0xA4270820 # sh $a3, 0x820($at)
/* 0x0026CCDC 0x802DC8DC 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x0026CCE0 0x802DC8E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026CCE4 0x802DC8E4 0xA422071C */ .word 0xA422071C # sh $v0, 0x71C($at)
/* 0x0026CCE8 0x802DC8E8 0x00000000 */ .word 0x00000000 # nop
/* 0x0026CCEC 0x802DC8EC 0x00000000 */ .word 0x00000000 # nop
