/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142200..0x00142258 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small-value region between neutral_encounter_table and creature_drop_table (88B): words 0x00003232/0x00003838/0x34340000/0x00004343 (ASCII-ish 2/8/4/C bytes); not decoded (hypothesis: terrain/threshold params).. */
/* 0x00142200 0x801B1E00 0x00000000 */ .word 0x00000000 # nop
/* 0x00142204 0x801B1E04 0x00000000 */ .word 0x00000000 # nop
/* 0x00142208 0x801B1E08 0x00003232 */ .word 0x00003232 # tlt $zero, $zero
/* 0x0014220C 0x801B1E0C 0x00000000 */ .word 0x00000000 # nop
/* 0x00142210 0x801B1E10 0x00000000 */ .word 0x00000000 # nop
/* 0x00142214 0x801B1E14 0x00000000 */ .word 0x00000000 # nop
/* 0x00142218 0x801B1E18 0x00000000 */ .word 0x00000000 # nop
/* 0x0014221C 0x801B1E1C 0x00000000 */ .word 0x00000000 # nop
/* 0x00142220 0x801B1E20 0x00000000 */ .word 0x00000000 # nop
/* 0x00142224 0x801B1E24 0x00000000 */ .word 0x00000000 # nop
/* 0x00142228 0x801B1E28 0x00000000 */ .word 0x00000000 # nop
/* 0x0014222C 0x801B1E2C 0x00000000 */ .word 0x00000000 # nop
/* 0x00142230 0x801B1E30 0x00003232 */ .word 0x00003232 # tlt $zero, $zero
/* 0x00142234 0x801B1E34 0x00000000 */ .word 0x00000000 # nop
/* 0x00142238 0x801B1E38 0x00003838 */ .word 0x00003838 # dsll $a3, $zero, 0
/* 0x0014223C 0x801B1E3C 0x00000000 */ .word 0x00000000 # nop
/* 0x00142240 0x801B1E40 0x00000000 */ .word 0x00000000 # nop
/* 0x00142244 0x801B1E44 0x00003232 */ .word 0x00003232 # tlt $zero, $zero
/* 0x00142248 0x801B1E48 0x34340000 */ .word 0x34340000 # ori $s4, $at, 0x0000
/* 0x0014224C 0x801B1E4C 0x00004343 */ .word 0x00004343 # sra $t0, $zero, 13
/* 0x00142250 0x801B1E50 0x00000000 */ .word 0x00000000 # nop
/* 0x00142254 0x801B1E54 0x00000000 */ .word 0x00000000 # nop
