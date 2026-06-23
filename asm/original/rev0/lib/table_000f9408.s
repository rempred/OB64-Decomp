/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000F9408..0x000F9440 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table, 14 words. Band 0x801A81A4..0x801A9570 (interleaved 0x801A8xxx and 0x801A93xx-0x801A95xx). Likely display-list / routine pointer table.. */
/* 0x000F9408 0x80169008 0x801A9304 */ .word 0x801A9304 # lb $k0, -0x6CFC($zero)
/* 0x000F940C 0x8016900C 0x801A81A4 */ .word 0x801A81A4 # lb $k0, -0x7E5C($zero)
/* 0x000F9410 0x80169010 0x801A8448 */ .word 0x801A8448 # lb $k0, -0x7BB8($zero)
/* 0x000F9414 0x80169014 0x801A93A4 */ .word 0x801A93A4 # lb $k0, -0x6C5C($zero)
/* 0x000F9418 0x80169018 0x801A86F0 */ .word 0x801A86F0 # lb $k0, -0x7910($zero)
/* 0x000F941C 0x8016901C 0x801A9438 */ .word 0x801A9438 # lb $k0, -0x6BC8($zero)
/* 0x000F9420 0x80169020 0x801A886C */ .word 0x801A886C # lb $k0, -0x7794($zero)
/* 0x000F9424 0x80169024 0x801A8A64 */ .word 0x801A8A64 # lb $k0, -0x759C($zero)
/* 0x000F9428 0x80169028 0x801A9490 */ .word 0x801A9490 # lb $k0, -0x6B70($zero)
/* 0x000F942C 0x8016902C 0x801A8C5C */ .word 0x801A8C5C # lb $k0, -0x73A4($zero)
/* 0x000F9430 0x80169030 0x801A94F8 */ .word 0x801A94F8 # lb $k0, -0x6B08($zero)
/* 0x000F9434 0x80169034 0x801A8E64 */ .word 0x801A8E64 # lb $k0, -0x719C($zero)
/* 0x000F9438 0x80169038 0x801A906C */ .word 0x801A906C # lb $k0, -0x6F94($zero)
/* 0x000F943C 0x8016903C 0x801A9570 */ .word 0x801A9570 # lb $k0, -0x6A90($zero)
