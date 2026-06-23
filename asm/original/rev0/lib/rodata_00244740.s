/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00244740..0x00244770 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string 'There is no detals message@nthis chacter.' (note '@n' control / sic spelling), NUL-terminated/padded. 48 bytes.. */
/* 0x00244740 0x802B4340 0x54686572 */ .word 0x54686572 # bnel $v1, $t0, 0x802CD90C
/* 0x00244744 0x802B4344 0x65206973 */ .word 0x65206973 # daddiu $zero, $t1, 0x6973
/* 0x00244748 0x802B4348 0x206E6F20 */ .word 0x206E6F20 # addi $t6, $v1, 0x6F20
/* 0x0024474C 0x802B434C 0x64657461 */ .word 0x64657461 # daddiu $a1, $v1, 0x7461
/* 0x00244750 0x802B4350 0x696C7320 */ .word 0x696C7320 # ldl $t4, 0x7320($t3)
/* 0x00244754 0x802B4354 0x6D657373 */ .word 0x6D657373 # ldr $a1, 0x7373($t3)
/* 0x00244758 0x802B4358 0x61676520 */ .word 0x61676520 # daddi $a3, $t3, 0x6520
/* 0x0024475C 0x802B435C 0x6F66406E */ .word 0x6F66406E # ldr $a2, 0x406E($k1)
/* 0x00244760 0x802B4360 0x74686973 */ .word 0x74686973 # op_0x1D
/* 0x00244764 0x802B4364 0x20636861 */ .word 0x20636861 # addi $v1, $v1, 0x6861
/* 0x00244768 0x802B4368 0x72637465 */ .word 0x72637465 # op_0x1C
/* 0x0024476C 0x802B436C 0x722E0000 */ .word 0x722E0000 # op_0x1C
