/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x0019C588..0x0019C5C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table (handler/jump-pointer array; targets are relocated 0x8021/0x8016-band code/data, NOT local-rodata string pointers). Overlay-relocated targets. RAM pointer table, 0x8016 band (13 entries). Sample values: 0x8016F65C, 0x8016F6AC, 0x8016F6FC, 0x8016F74C, ... 0x8016F8CC. Evenly-strided pointers (likely fixed-size record/string array). Trailing single zero word at 0x19C5BC folded in as table terminator.. */
/* 0x0019C588 0x8020C188 0x8016F65C */ .word 0x8016F65C # lb $s6, -0x9A4($zero)
/* 0x0019C58C 0x8020C18C 0x8016F6AC */ .word 0x8016F6AC # lb $s6, -0x954($zero)
/* 0x0019C590 0x8020C190 0x8016F6FC */ .word 0x8016F6FC # lb $s6, -0x904($zero)
/* 0x0019C594 0x8020C194 0x8016F74C */ .word 0x8016F74C # lb $s6, -0x8B4($zero)
/* 0x0019C598 0x8020C198 0x8016F79C */ .word 0x8016F79C # lb $s6, -0x864($zero)
/* 0x0019C59C 0x8020C19C 0x8016F7EC */ .word 0x8016F7EC # lb $s6, -0x814($zero)
/* 0x0019C5A0 0x8020C1A0 0x8016F83C */ .word 0x8016F83C # lb $s6, -0x7C4($zero)
/* 0x0019C5A4 0x8020C1A4 0x8016F854 */ .word 0x8016F854 # lb $s6, -0x7AC($zero)
/* 0x0019C5A8 0x8020C1A8 0x8016F86C */ .word 0x8016F86C # lb $s6, -0x794($zero)
/* 0x0019C5AC 0x8020C1AC 0x8016F884 */ .word 0x8016F884 # lb $s6, -0x77C($zero)
/* 0x0019C5B0 0x8020C1B0 0x8016F89C */ .word 0x8016F89C # lb $s6, -0x764($zero)
/* 0x0019C5B4 0x8020C1B4 0x8016F8B4 */ .word 0x8016F8B4 # lb $s6, -0x74C($zero)
/* 0x0019C5B8 0x8020C1B8 0x8016F8CC */ .word 0x8016F8CC # lb $s6, -0x734($zero)
/* 0x0019C5BC 0x8020C1BC 0x00000000 */ .word 0x00000000 # nop
