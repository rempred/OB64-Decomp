/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000465A4..0x000465C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/subu index math), jr $ra at 0x465B8 + delay 0x465BC */
func_000465a4:
/* 0x000465A4 0x800B61A4 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x000465A8 0x800B61A8 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000465AC 0x800B61AC 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x000465B0 0x800B61B0 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000465B4 0x800B61B4 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000465B8 0x800B61B8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000465BC 0x800B61BC 0x90223BDA */ .word 0x90223BDA # lbu $v0, 0x3BDA($at)
