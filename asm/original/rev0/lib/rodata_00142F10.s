/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142F10..0x00142F30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII error string 0x4D454D20='MEM ' .. 0x61290A00='a)',LF,NUL. Zero-padded. [name-token: rodata_str_MEM_Error_d]. */
/* 0x00142F10 0x801B2B10 0x4D454D20 */ .word 0x4D454D20 # op_0x13
/* 0x00142F14 0x801B2B14 0x4572726F */ .word 0x4572726F # cop1_0x2F.fmt11
/* 0x00142F18 0x801B2B18 0x72322E20 */ .word 0x72322E20 # op_0x1C
/* 0x00142F1C 0x801B2B1C 0x28557064 */ .word 0x28557064 # slti $s5, $v0, 0x7064
/* 0x00142F20 0x801B2B20 0x6174614B */ .word 0x6174614B # daddi $s4, $t3, 0x614B
/* 0x00142F24 0x801B2B24 0x796F7465 */ .word 0x796F7465 # op_0x1E
/* 0x00142F28 0x801B2B28 0x6E446174 */ .word 0x6E446174 # ldr $a0, 0x6174($s2)
/* 0x00142F2C 0x801B2B2C 0x61290A00 */ .word 0x61290A00 # daddi $t1, $t1, 0xA00
