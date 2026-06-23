/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x00152638..0x001526AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry is the read-before-write preamble at 0x152638 (lui $v1,0x8019; lhu 0xF82; lui/ori 0xAAAAAAAB; multu $v1,$v0) whose HI result is consumed by mfhi $t0 at 0x152668 inside the body. Inner prologue addiu $sp,-0x8 at 0x15264C. Folded forward; own name. jr $ra at 0x1526A4 + delay addiu $sp,0x8 at 0x1526A8 = slice end. */
func_00152638:
/* 0x00152638 0x801C2238 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x0015263C 0x801C223C 0x94630F82 */ .word 0x94630F82 # lhu $v1, 0xF82($v1)
/* 0x00152640 0x801C2240 0x3C02AAAA */ .word 0x3C02AAAA # lui $v0, 0xAAAA
/* 0x00152644 0x801C2244 0x3442AAAB */ .word 0x3442AAAB # ori $v0, $v0, 0xAAAB
/* 0x00152648 0x801C2248 0x00620019 */ .word 0x00620019 # multu $v1, $v0

/* function boundary candidate: func_0015264C, size=96, kind=prologue */
func_0015264C:
/* 0x0015264C 0x801C224C 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00152650 0x801C2250 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00152654 0x801C2254 0x00042040 */ .word 0x00042040 # sll $a0, $a0, 1
/* 0x00152658 0x801C2258 0x3C068019 */ .word 0x3C068019 # lui $a2, 0x8019
/* 0x0015265C 0x801C225C 0x00C43021 */ .word 0x00C43021 # addu $a2, $a2, $a0
/* 0x00152660 0x801C2260 0x94C60EBC */ .word 0x94C60EBC # lhu $a2, 0xEBC($a2)
/* 0x00152664 0x801C2264 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00152668 0x801C2268 0x00004010 */ .word 0x00004010 # mfhi $t0
/* 0x0015266C 0x801C226C 0x00081042 */ .word 0x00081042 # srl $v0, $t0, 1
/* 0x00152670 0x801C2270 0x3047FFFF */ .word 0x3047FFFF # andi $a3, $v0, 0xFFFF
/* 0x00152674 0x801C2274 0x00C73023 */ .word 0x00C73023 # subu $a2, $a2, $a3
/* 0x00152678 0x801C2278 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0015267C 0x801C227C 0x0006182A */ .word 0x0006182A # slt $v1, $zero, $a2
/* 0x00152680 0x801C2280 0x30A4FFFF */ .word 0x30A4FFFF # andi $a0, $a1, 0xFFFF
/* 0x00152684 0x801C2284 0x2C820003 */ .word 0x2C820003 # sltiu $v0, $a0, 0x3
/* 0x00152688 0x801C2288 0x00621824 */ .word 0x00621824 # and $v1, $v1, $v0
/* 0x0015268C 0x801C228C 0x5460FFFA */ .word 0x5460FFFA # bnel $v1, $zero, 0x801C2278
/* 0x00152690 0x801C2290 0x00C73023 */ .word 0x00C73023 # subu $a2, $a2, $a3
/* 0x00152694 0x801C2294 0x2C820004 */ .word 0x2C820004 # sltiu $v0, $a0, 0x4
/* 0x00152698 0x801C2298 0x50400001 */ .word 0x50400001 # beql $v0, $zero, 0x801C22A0
/* 0x0015269C 0x801C229C 0x24050003 */ .word 0x24050003 # addiu $a1, $zero, 0x3
/* 0x001526A0 0x801C22A0 0x30A2FFFF */ .word 0x30A2FFFF # andi $v0, $a1, 0xFFFF
/* 0x001526A4 0x801C22A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001526A8 0x801C22A8 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
