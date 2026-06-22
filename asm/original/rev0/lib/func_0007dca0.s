/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x0007DCA0..0x0007DCE8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent record idx16; prologue addiu $sp,-0x18, jal callees. jr $ra at 0x0007DCE0 + delay slot 0x0007DCE4. Remaining bytes are a separate frameless leaf (parent leadingGap covered this region). */
/* function boundary candidate: func_0007DCA0, size=72, kind=prologue */
func_0007DCA0:
/* 0x0007DCA0 0x800ED8A0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0007DCA4 0x800ED8A4 0x3C040002 */ .word 0x3C040002 # lui $a0, 0x0002
/* 0x0007DCA8 0x800ED8A8 0x34845800 */ .word 0x34845800 # ori $a0, $a0, 0x5800
/* 0x0007DCAC 0x800ED8AC 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0007DCB0 0x800ED8B0 0x0C01C3CC */ .word 0x0C01C3CC # jal 0x80070F30
/* 0x0007DCB4 0x800ED8B4 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x0007DCB8 0x800ED8B8 0x3C04800C */ .word 0x3C04800C # lui $a0, 0x800C
/* 0x0007DCBC 0x800ED8BC 0x8C844BB8 */ .word 0x8C844BB8 # lw $a0, 0x4BB8($a0)
/* 0x0007DCC0 0x800ED8C0 0x3C060002 */ .word 0x3C060002 # lui $a2, 0x0002
/* 0x0007DCC4 0x800ED8C4 0x34C65800 */ .word 0x34C65800 # ori $a2, $a2, 0x5800
/* 0x0007DCC8 0x800ED8C8 0x00408021 */ .word 0x00408021 # move $s0, $v0
/* 0x0007DCCC 0x800ED8CC 0x0C024C18 */ .word 0x0C024C18 # jal 0x80093060
/* 0x0007DCD0 0x800ED8D0 0x02002821 */ .word 0x02002821 # move $a1, $s0
/* 0x0007DCD4 0x800ED8D4 0x02001021 */ .word 0x02001021 # move $v0, $s0
/* 0x0007DCD8 0x800ED8D8 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0007DCDC 0x800ED8DC 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x0007DCE0 0x800ED8E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0007DCE4 0x800ED8E4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
