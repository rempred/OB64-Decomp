/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C2F94..0x001C2FC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small mixed pointer/record table with scalar count word 0xAC and RAM-like references; classified data by no-code evidence.. */
/* 0x001C2F94 0x80232B94 0x000000AC */ .word 0x000000AC # dadd $zero, $zero, $zero
/* 0x001C2F98 0x80232B98 0x8022D010 */ .word 0x8022D010 # lb $v0, -0x2FF0($at)
/* 0x001C2F9C 0x80232B9C 0x8022AA74 */ .word 0x8022AA74 # lb $v0, -0x558C($at)
/* 0x001C2FA0 0x80232BA0 0x8022A86C */ .word 0x8022A86C # lb $v0, -0x5794($at)
/* 0x001C2FA4 0x80232BA4 0x8022D164 */ .word 0x8022D164 # lb $v0, -0x2E9C($at)
/* 0x001C2FA8 0x80232BA8 0x802305C4 */ .word 0x802305C4 # lb $v1, 0x5C4($at)
/* 0x001C2FAC 0x80232BAC 0x00000008 */ .word 0x00000008 # jr $zero
/* 0x001C2FB0 0x80232BB0 0x00000084 */ .word 0x00000084 # sllv $zero, $zero, $zero
/* 0x001C2FB4 0x80232BB4 0x8022A9E0 */ .word 0x8022A9E0 # lb $v0, -0x5620($at)
/* 0x001C2FB8 0x80232BB8 0x8022A85C */ .word 0x8022A85C # lb $v0, -0x57A4($at)
/* 0x001C2FBC 0x80232BBC 0x8022A840 */ .word 0x8022A840 # lb $v0, -0x57C0($at)
