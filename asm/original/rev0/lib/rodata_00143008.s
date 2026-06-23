/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00143008..0x00143028 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string fragment 0x6E6F2073='no s' .. 0x5B25645D='[%d]', 0x0A000000=LF,NUL. Zero-padded; 1 trailing zero word. [name-token: rodata_str_no_s_pct_d]. */
/* 0x00143008 0x801B2C08 0x6E6F2073 */ .word 0x6E6F2073 # ldr $t7, 0x2073($s3)
/* 0x0014300C 0x801B2C0C 0x70616365 */ .word 0x70616365 # op_0x1C
/* 0x00143010 0x801B2C10 0x20746F20 */ .word 0x20746F20 # addi $s4, $v1, 0x6F20
/* 0x00143014 0x801B2C14 0x70757420 */ .word 0x70757420 # op_0x1C
/* 0x00143018 0x801B2C18 0x6974656D */ .word 0x6974656D # ldl $s4, 0x656D($t3)
/* 0x0014301C 0x801B2C1C 0x5B25645D */ .word 0x5B25645D # blezl $t9, 0x801CBD94
/* 0x00143020 0x801B2C20 0x0A000000 */ .word 0x0A000000 # j 0x88000000
/* 0x00143024 0x801B2C24 0x00000000 */ .word 0x00000000 # nop
