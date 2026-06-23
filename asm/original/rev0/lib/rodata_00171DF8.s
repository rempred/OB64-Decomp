/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00171DF8..0x00171E10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Big-endian ASCII '{Cn}' format/color control tokens, each followed by a 0x00000000 separator. Decoded: 0x7B43367D='{C6}', 0x7B43307D='{C0}', 0x7B43387D='{C8}' (0x7B='{',0x43='C',0x36/30/38='6'/'0'/'8',0x7D='}'). (swarm-label: rodata_00171DF8_format_tokens). */
/* 0x00171DF8 0x801E19F8 0x7B43367D */ .word 0x7B43367D # op_0x1E
/* 0x00171DFC 0x801E19FC 0x00000000 */ .word 0x00000000 # nop
/* 0x00171E00 0x801E1A00 0x7B43307D */ .word 0x7B43307D # op_0x1E
/* 0x00171E04 0x801E1A04 0x00000000 */ .word 0x00000000 # nop
/* 0x00171E08 0x801E1A08 0x7B43387D */ .word 0x7B43387D # op_0x1E
/* 0x00171E0C 0x801E1A0C 0x00000000 */ .word 0x00000000 # nop
