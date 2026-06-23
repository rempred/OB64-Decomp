/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x00299FA4..0x00299FE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table, 15 words, all 0x8023E2xx descending from 0x8023E2D0 to 0x8023E260 (step ~8); pointers into a 0x8023Exxx data/string pool.. */
/* 0x00299FA4 0x80309BA4 0x8023E2D0 */ .word 0x8023E2D0 # lb $v1, -0x1D30($at)
/* 0x00299FA8 0x80309BA8 0x8023E2C8 */ .word 0x8023E2C8 # lb $v1, -0x1D38($at)
/* 0x00299FAC 0x80309BAC 0x8023E2C0 */ .word 0x8023E2C0 # lb $v1, -0x1D40($at)
/* 0x00299FB0 0x80309BB0 0x8023E2B8 */ .word 0x8023E2B8 # lb $v1, -0x1D48($at)
/* 0x00299FB4 0x80309BB4 0x8023E2B0 */ .word 0x8023E2B0 # lb $v1, -0x1D50($at)
/* 0x00299FB8 0x80309BB8 0x8023E2A8 */ .word 0x8023E2A8 # lb $v1, -0x1D58($at)
/* 0x00299FBC 0x80309BBC 0x8023E2A0 */ .word 0x8023E2A0 # lb $v1, -0x1D60($at)
/* 0x00299FC0 0x80309BC0 0x8023E298 */ .word 0x8023E298 # lb $v1, -0x1D68($at)
/* 0x00299FC4 0x80309BC4 0x8023E290 */ .word 0x8023E290 # lb $v1, -0x1D70($at)
/* 0x00299FC8 0x80309BC8 0x8023E288 */ .word 0x8023E288 # lb $v1, -0x1D78($at)
/* 0x00299FCC 0x80309BCC 0x8023E280 */ .word 0x8023E280 # lb $v1, -0x1D80($at)
/* 0x00299FD0 0x80309BD0 0x8023E278 */ .word 0x8023E278 # lb $v1, -0x1D88($at)
/* 0x00299FD4 0x80309BD4 0x8023E270 */ .word 0x8023E270 # lb $v1, -0x1D90($at)
/* 0x00299FD8 0x80309BD8 0x8023E268 */ .word 0x8023E268 # lb $v1, -0x1D98($at)
/* 0x00299FDC 0x80309BDC 0x8023E260 */ .word 0x8023E260 # lb $v1, -0x1DA0($at)
