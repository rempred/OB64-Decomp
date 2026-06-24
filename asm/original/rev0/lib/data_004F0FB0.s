/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_004E1000_004F1000.s
 * z64 range: 0x004F0FB0..0x004F1000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): First cutscene AUDIO-SEQUENCE block HEAD (parser-backed): block 0 of the 63 contiguous cutscene music/SFX sequence blocks (0x4F0FB0..0x594280) per parent scripts/ob64_anim_block_catalog.json + tools/anim_block_codec.py (roundtrip_ok, gate-proven). Tag 0x00000215 @0x4F0FB0 (matches the catalog/survey). This is the HEAD only (80 B in chunk 78); the block continues past 0x4F1000 -> OUTGOING natural-unit continuation into chunk 79. raw-but-classified (parser-backed block; not chunk-locally decodable).. */
/* 0x004F0FB0 0x80560BB0 0x00000215 */ .word 0x00000215 # special_0x15
/* 0x004F0FB4 0x80560BB4 0x00000018 */ .word 0x00000018 # mult $zero, $zero
/* 0x004F0FB8 0x80560BB8 0x00000023 */ .word 0x00000023 # subu $zero, $zero, $zero
/* 0x004F0FBC 0x80560BBC 0x00000038 */ .word 0x00000038 # dsll $zero, $zero, 0
/* 0x004F0FC0 0x80560BC0 0x00000098 */ .word 0x00000098 # mult $zero, $zero
/* 0x004F0FC4 0x80560BC4 0x000000F8 */ .word 0x000000F8 # dsll $zero, $zero, 3
/* 0x004F0FC8 0x80560BC8 0x000001A0 */ .word 0x000001A0 # add $zero, $zero, $zero
/* 0x004F0FCC 0x80560BCC 0x000001A0 */ .word 0x000001A0 # add $zero, $zero, $zero
/* 0x004F0FD0 0x80560BD0 0x00000158 */ .word 0x00000158 # mult $zero, $zero
/* 0x004F0FD4 0x80560BD4 0x000007E4 */ .word 0x000007E4 # and $zero, $zero, $zero
/* 0x004F0FD8 0x80560BD8 0x00000000 */ .word 0x00000000 # nop
/* 0x004F0FDC 0x80560BDC 0x00000000 */ .word 0x00000000 # nop
/* 0x004F0FE0 0x80560BE0 0x00000000 */ .word 0x00000000 # nop
/* 0x004F0FE4 0x80560BE4 0x00000000 */ .word 0x00000000 # nop
/* 0x004F0FE8 0x80560BE8 0x00000810 */ .word 0x00000810 # mfhi $at
/* 0x004F0FEC 0x80560BEC 0x00000A1B */ .word 0x00000A1B # divu $zero, $zero
/* 0x004F0FF0 0x80560BF0 0x00000C9A */ .word 0x00000C9A # div $zero, $zero
/* 0x004F0FF4 0x80560BF4 0x00000EEB */ .word 0x00000EEB # sltu $at, $zero, $zero
/* 0x004F0FF8 0x80560BF8 0x0000117A */ .word 0x0000117A # dsrl $v0, $zero, 5
/* 0x004F0FFC 0x80560BFC 0x000013B2 */ .word 0x000013B2 # tlt $zero, $zero
