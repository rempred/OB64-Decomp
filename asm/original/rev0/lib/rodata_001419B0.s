/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001419B0..0x001419D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Short ASCII strings, NUL-terminated. 0x436F6E66 0x69726D00 = "Confirm\0"; 0x41636B6E 0x6F776C65 0x64676564 0x00000000 = "Acknowledged\0"; 0x59657300 = "Yes\0"; 0x4E6F0000 = "No\0". UI/menu label strings.. */
/* 0x001419B0 0x801B15B0 0x436F6E66 */ .word 0x436F6E66 # cop0_0x1B
/* 0x001419B4 0x801B15B4 0x69726D00 */ .word 0x69726D00 # ldl $s2, 0x6D00($t3)
/* 0x001419B8 0x801B15B8 0x41636B6E */ .word 0x41636B6E # cop0_0x0B
/* 0x001419BC 0x801B15BC 0x6F776C65 */ .word 0x6F776C65 # ldr $s7, 0x6C65($k1)
/* 0x001419C0 0x801B15C0 0x64676564 */ .word 0x64676564 # daddiu $a3, $v1, 0x6564
/* 0x001419C4 0x801B15C4 0x00000000 */ .word 0x00000000 # nop
/* 0x001419C8 0x801B15C8 0x59657300 */ .word 0x59657300 # blezl $t3, 0x801CE1CC
/* 0x001419CC 0x801B15CC 0x4E6F0000 */ .word 0x4E6F0000 # op_0x13
