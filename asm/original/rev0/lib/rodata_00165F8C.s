/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00165F8C..0x00165FB0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII control-token markers of the form '{Cn}' (open-brace, 'C', digit, close-brace), each in its own word, zero-separated. Decoded: 0x7B43367D='{C6}', 0x7B43377D='{C7}', 0x7B43307D='{C0}', 0x7B43317D='{C1}', each followed by 0x00000000 (and an extra 0x00000000 at 0x165FAC). These are in-string formatting/color control tokens.. */
/* 0x00165F8C 0x801D5B8C 0x7B43367D */ .word 0x7B43367D # op_0x1E
/* 0x00165F90 0x801D5B90 0x00000000 */ .word 0x00000000 # nop
/* 0x00165F94 0x801D5B94 0x7B43377D */ .word 0x7B43377D # op_0x1E
/* 0x00165F98 0x801D5B98 0x00000000 */ .word 0x00000000 # nop
/* 0x00165F9C 0x801D5B9C 0x7B43307D */ .word 0x7B43307D # op_0x1E
/* 0x00165FA0 0x801D5BA0 0x00000000 */ .word 0x00000000 # nop
/* 0x00165FA4 0x801D5BA4 0x7B43317D */ .word 0x7B43317D # op_0x1E
/* 0x00165FA8 0x801D5BA8 0x00000000 */ .word 0x00000000 # nop
/* 0x00165FAC 0x801D5BAC 0x00000000 */ .word 0x00000000 # nop
