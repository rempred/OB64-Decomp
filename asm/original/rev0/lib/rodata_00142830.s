/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142830..0x00142850 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string 'Mem error. (Magnetic))' + newline (0x4D656D20='Mem ' .. 0x2829290A=' ))',LF). Zero-padded to 0x142848; 2 zero words follow. [name-token: rodata_str_Magnetic]. */
/* 0x00142830 0x801B2430 0x4D656D20 */ .word 0x4D656D20 # op_0x13
/* 0x00142834 0x801B2434 0x6572726F */ .word 0x6572726F # daddiu $s2, $t3, 0x726F
/* 0x00142838 0x801B2438 0x722E2028 */ .word 0x722E2028 # op_0x1C
/* 0x0014283C 0x801B243C 0x4D61676E */ .word 0x4D61676E # op_0x13
/* 0x00142840 0x801B2440 0x65746963 */ .word 0x65746963 # daddiu $s4, $t3, 0x6963
/* 0x00142844 0x801B2444 0x2829290A */ .word 0x2829290A # slti $t1, $at, 0x290A
/* 0x00142848 0x801B2448 0x00000000 */ .word 0x00000000 # nop
/* 0x0014284C 0x801B244C 0x00000000 */ .word 0x00000000 # nop
