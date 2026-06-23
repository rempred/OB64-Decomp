/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142B10..0x00142B50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two ASCII error strings: 'MEM Error.(spMakeTable1)' and 'MEM Error.(MakeSpleneTable)' each newline+NUL terminated (0x4D454D20='MEM ' .. 0x53706C69='Spli'). Zero-padded; trailing zero word at 0x142B4C. [name-token: rodata_str_spMakeTable]. */
/* 0x00142B10 0x801B2710 0x4D454D20 */ .word 0x4D454D20 # op_0x13
/* 0x00142B14 0x801B2714 0x4572726F */ .word 0x4572726F # cop1_0x2F.fmt11
/* 0x00142B18 0x801B2718 0x722E2028 */ .word 0x722E2028 # op_0x1C
/* 0x00142B1C 0x801B271C 0x73704D61 */ .word 0x73704D61 # op_0x1C
/* 0x00142B20 0x801B2720 0x6B655461 */ .word 0x6B655461 # ldl $a1, 0x5461($k1)
/* 0x00142B24 0x801B2724 0x626C6531 */ .word 0x626C6531 # daddi $t4, $s3, 0x6531
/* 0x00142B28 0x801B2728 0x290A0000 */ .word 0x290A0000 # slti $t2, $t0, 0x0
/* 0x00142B2C 0x801B272C 0x4D454D20 */ .word 0x4D454D20 # op_0x13
/* 0x00142B30 0x801B2730 0x4572726F */ .word 0x4572726F # cop1_0x2F.fmt11
/* 0x00142B34 0x801B2734 0x722E2028 */ .word 0x722E2028 # op_0x1C
/* 0x00142B38 0x801B2738 0x4D616B65 */ .word 0x4D616B65 # op_0x13
/* 0x00142B3C 0x801B273C 0x53706C69 */ .word 0x53706C69 # beql $k1, $s0, 0x801CD8E4
/* 0x00142B40 0x801B2740 0x6E655461 */ .word 0x6E655461 # ldr $a1, 0x5461($s3)
/* 0x00142B44 0x801B2744 0x626C6529 */ .word 0x626C6529 # daddi $t4, $s3, 0x6529
/* 0x00142B48 0x801B2748 0x0A000000 */ .word 0x0A000000 # j 0x88000000
/* 0x00142B4C 0x801B274C 0x00000000 */ .word 0x00000000 # nop
