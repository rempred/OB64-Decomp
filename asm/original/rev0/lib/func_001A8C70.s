/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A8C70..0x001A8CCC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no addiu $sp prologue) reached by non-prologue fall-through after func_001A838C's jr$ra delay slot. andi $a0,$a0,0xFF @0x1A8C70; compares two 0x8018:0x7C1A/0x7C59-band table bytes and returns a boolean in $v0. Contains an internal j 0x80219034 overlay tail-jump @0x1A8CA4 (delay xori@0x1A8CA8) kept INTERNAL. Ends jr$ra@0x1A8CC4 + delay sltiu $v0,$v0,0x1@0x1A8CC8. */
func_001A8C70:
/* 0x001A8C70 0x80218870 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x001A8C74 0x80218874 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x001A8C78 0x80218878 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x001A8C7C 0x8021887C 0x000218C0 */ .word 0x000218C0 # sll $v1, $v0, 3
/* 0x001A8C80 0x80218880 0x3C028018 */ .word 0x3C028018 # lui $v0, 0x8018
/* 0x001A8C84 0x80218884 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x001A8C88 0x80218888 0x90427C59 */ .word 0x90427C59 # lbu $v0, 0x7C59($v0)
/* 0x001A8C8C 0x8021888C 0x30A500FF */ .word 0x30A500FF # andi $a1, $a1, 0x00FF
/* 0x001A8C90 0x80218890 0x54450006 */ .word 0x54450006 # bnel $v0, $a1, 0x802188AC
/* 0x001A8C94 0x80218894 0x000510C0 */ .word 0x000510C0 # sll $v0, $a1, 3
/* 0x001A8C98 0x80218898 0x3C028018 */ .word 0x3C028018 # lui $v0, 0x8018
/* 0x001A8C9C 0x8021889C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x001A8CA0 0x802188A0 0x90427C1A */ .word 0x90427C1A # lbu $v0, 0x7C1A($v0)
/* 0x001A8CA4 0x802188A4 0x0808640D */ .word 0x0808640D # j 0x80219034
/* 0x001A8CA8 0x802188A8 0x38420002 */ .word 0x38420002 # xori $v0, $v0, 0x0002
/* 0x001A8CAC 0x802188AC 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x001A8CB0 0x802188B0 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x001A8CB4 0x802188B4 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x001A8CB8 0x802188B8 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x001A8CBC 0x802188BC 0x90227C1A */ .word 0x90227C1A # lbu $v0, 0x7C1A($at)
/* 0x001A8CC0 0x802188C0 0x38420002 */ .word 0x38420002 # xori $v0, $v0, 0x0002
/* 0x001A8CC4 0x802188C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001A8CC8 0x802188C8 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
