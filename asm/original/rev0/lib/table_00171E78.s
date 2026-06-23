/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00171E78..0x00171EA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table, 0x8021 band, with trailing zero pad. Evidence: 0x8021D2E8 0x8021D284 0x8021D238 0x8021D46C 0x8021D424 0x8021D3C4 0x8021D390 0x8021D330 (eight 0x8021Dxxx pointers), then two 0x00000000 pad words at 0x171E98-0x171E9C. Region ends at 0x171EA0 (real code begins there). (swarm-label: table_00171E78_ptr8021_zpad). */
/* 0x00171E78 0x801E1A78 0x8021D2E8 */ .word 0x8021D2E8 # lb $at, -0x2D18($at)
/* 0x00171E7C 0x801E1A7C 0x8021D284 */ .word 0x8021D284 # lb $at, -0x2D7C($at)
/* 0x00171E80 0x801E1A80 0x8021D238 */ .word 0x8021D238 # lb $at, -0x2DC8($at)
/* 0x00171E84 0x801E1A84 0x8021D46C */ .word 0x8021D46C # lb $at, -0x2B94($at)
/* 0x00171E88 0x801E1A88 0x8021D424 */ .word 0x8021D424 # lb $at, -0x2BDC($at)
/* 0x00171E8C 0x801E1A8C 0x8021D3C4 */ .word 0x8021D3C4 # lb $at, -0x2C3C($at)
/* 0x00171E90 0x801E1A90 0x8021D390 */ .word 0x8021D390 # lb $at, -0x2C70($at)
/* 0x00171E94 0x801E1A94 0x8021D330 */ .word 0x8021D330 # lb $at, -0x2CD0($at)
/* 0x00171E98 0x801E1A98 0x00000000 */ .word 0x00000000 # nop
/* 0x00171E9C 0x801E1A9C 0x00000000 */ .word 0x00000000 # nop
