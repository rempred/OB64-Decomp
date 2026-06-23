/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213250..0x00213290 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 16 x u32 RAM pointers, 0x801AF2xx band (0x801AF290..0x801AF2B4); 8x repeat of 0x801AF2B4 then 0x801AF2B0/2A0/2A8/290/298/2A0/2A8. Final word 0x0A000000 (stray/filler index) included.. */
/* 0x00213250 0x80282E50 0x801AF2B4 */ .word 0x801AF2B4 # lb $k0, -0xD4C($zero)
/* 0x00213254 0x80282E54 0x801AF2B4 */ .word 0x801AF2B4 # lb $k0, -0xD4C($zero)
/* 0x00213258 0x80282E58 0x801AF2B4 */ .word 0x801AF2B4 # lb $k0, -0xD4C($zero)
/* 0x0021325C 0x80282E5C 0x801AF2B4 */ .word 0x801AF2B4 # lb $k0, -0xD4C($zero)
/* 0x00213260 0x80282E60 0x801AF2B4 */ .word 0x801AF2B4 # lb $k0, -0xD4C($zero)
/* 0x00213264 0x80282E64 0x801AF2B4 */ .word 0x801AF2B4 # lb $k0, -0xD4C($zero)
/* 0x00213268 0x80282E68 0x801AF2B4 */ .word 0x801AF2B4 # lb $k0, -0xD4C($zero)
/* 0x0021326C 0x80282E6C 0x801AF2B4 */ .word 0x801AF2B4 # lb $k0, -0xD4C($zero)
/* 0x00213270 0x80282E70 0x801AF2B0 */ .word 0x801AF2B0 # lb $k0, -0xD50($zero)
/* 0x00213274 0x80282E74 0x801AF2A0 */ .word 0x801AF2A0 # lb $k0, -0xD60($zero)
/* 0x00213278 0x80282E78 0x801AF2A8 */ .word 0x801AF2A8 # lb $k0, -0xD58($zero)
/* 0x0021327C 0x80282E7C 0x801AF290 */ .word 0x801AF290 # lb $k0, -0xD70($zero)
/* 0x00213280 0x80282E80 0x801AF298 */ .word 0x801AF298 # lb $k0, -0xD68($zero)
/* 0x00213284 0x80282E84 0x801AF2A0 */ .word 0x801AF2A0 # lb $k0, -0xD60($zero)
/* 0x00213288 0x80282E88 0x801AF2A8 */ .word 0x801AF2A8 # lb $k0, -0xD58($zero)
/* 0x0021328C 0x80282E8C 0x0A000000 */ .word 0x0A000000 # j 0x88000000
