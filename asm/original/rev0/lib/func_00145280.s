/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145280..0x00145290 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS-LEAF recovered [adversarial]. 3-instr predicate: xori $v0,$a0,0x87 / jr $ra@0x145284 / delay sltiu $v0,$v0,1@0x145288 (returns $a0==0x87); 1 trailing alignment nop@0x14528C absorbed. */
/* 0x00145280 0x801B4E80 0x38820087 */ .word 0x38820087 # xori $v0, $a0, 0x0087
/* 0x00145284 0x801B4E84 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145288 0x801B4E88 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x0014528C 0x801B4E8C 0x00000000 */ .word 0x00000000 # nop
