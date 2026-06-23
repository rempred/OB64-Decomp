/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x00240EB0..0x00240EC8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no addiu$sp prologue): lui$v1,0x801F; lw -0x1B8; lhu 0x650; ori |0x0002; jr$ra@0x00240EC0 + delay sh 0x650($v1). Sets bit 1 of flag word at +0x650. */
func_00240EB0:
/* 0x00240EB0 0x802B0AB0 0x3C03801F */ .word 0x3C03801F # lui $v1, 0x801F
/* 0x00240EB4 0x802B0AB4 0x8C63FE48 */ .word 0x8C63FE48 # lw $v1, -0x1B8($v1)
/* 0x00240EB8 0x802B0AB8 0x94620650 */ .word 0x94620650 # lhu $v0, 0x650($v1)
/* 0x00240EBC 0x802B0ABC 0x34420002 */ .word 0x34420002 # ori $v0, $v0, 0x0002
/* 0x00240EC0 0x802B0AC0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00240EC4 0x802B0AC4 0xA4620650 */ .word 0xA4620650 # sh $v0, 0x650($v1)
