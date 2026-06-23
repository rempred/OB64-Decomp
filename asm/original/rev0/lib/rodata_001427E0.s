/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001427E0..0x00142810 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII printf string: 'Value cannot be reached.(MakeRouteList):%d' + newline (0x56616C75='Valu' .. 0x25640A00='%d',LF,NUL). Zero-padded to 0x142810. [name-token: rodata_str_MakeRouteList]. */
/* 0x001427E0 0x801B23E0 0x56616C75 */ .word 0x56616C75 # bnel $s3, $at, 0x801CD5B8
/* 0x001427E4 0x801B23E4 0x65206361 */ .word 0x65206361 # daddiu $zero, $t1, 0x6361
/* 0x001427E8 0x801B23E8 0x6E6E6F74 */ .word 0x6E6E6F74 # ldr $t6, 0x6F74($s3)
/* 0x001427EC 0x801B23EC 0x20626520 */ .word 0x20626520 # addi $v0, $v1, 0x6520
/* 0x001427F0 0x801B23F0 0x72656163 */ .word 0x72656163 # op_0x1C
/* 0x001427F4 0x801B23F4 0x6865642E */ .word 0x6865642E # ldl $a1, 0x642E($v1)
/* 0x001427F8 0x801B23F8 0x284D616B */ .word 0x284D616B # slti $t5, $v0, 0x616B
/* 0x001427FC 0x801B23FC 0x65526F75 */ .word 0x65526F75 # daddiu $s2, $t2, 0x6F75
/* 0x00142800 0x801B2400 0x74654C69 */ .word 0x74654C69 # op_0x1D
/* 0x00142804 0x801B2404 0x7374293A */ .word 0x7374293A # op_0x1C
/* 0x00142808 0x801B2408 0x25640A00 */ .word 0x25640A00 # addiu $a0, $t3, 0xA00
/* 0x0014280C 0x801B240C 0x00000000 */ .word 0x00000000 # nop
