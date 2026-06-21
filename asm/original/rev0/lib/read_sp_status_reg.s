/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00023DF0..0x00023E00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00023DF0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
read_sp_status_reg:
/* 0x00023DF0 0x800939F0 0x3C02A404 */ .word 0x3C02A404 # lui $v0, 0xA404
/* 0x00023DF4 0x800939F4 0x34420010 */ .word 0x34420010 # ori $v0, $v0, 0x0010
/* 0x00023DF8 0x800939F8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00023DFC 0x800939FC 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
