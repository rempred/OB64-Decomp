/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00163558..0x00163580 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000-style lead (here 0x0001D8CE) then high-entropy record: 0x53F35C2F,0x6CB18533,0x5C71A5F1,0x6CA795A5,0x851F3B83,0xAE1F9D59,0x2907FFFF. Ends in 0xFFFF; no ascii. HYPOTHESIS: packed codebook/ramp row. [name-token: data_00163558_block_DF]. */
/* 0x00163558 0x801D3158 0x0001D8CE */ .word 0x0001D8CE # special_0x0E
/* 0x0016355C 0x801D315C 0x53F35C2F */ .word 0x53F35C2F # beql $ra, $s3, 0x801EA21C
/* 0x00163560 0x801D3160 0x6CB18533 */ .word 0x6CB18533 # ldr $s1, -0x7ACD($a1)
/* 0x00163564 0x801D3164 0x5C71A5F1 */ .word 0x5C71A5F1 # bgtzl $v1, 0x801BC92C
/* 0x00163568 0x801D3168 0x6CA795A5 */ .word 0x6CA795A5 # ldr $a3, -0x6A5B($a1)
/* 0x0016356C 0x801D316C 0x851F3B83 */ .word 0x851F3B83 # lh $ra, 0x3B83($t0)
/* 0x00163570 0x801D3170 0xAE1F9D59 */ .word 0xAE1F9D59 # sw $ra, -0x62A7($s0)
/* 0x00163574 0x801D3174 0x2907FFFF */ .word 0x2907FFFF # slti $a3, $t0, -0x1
/* 0x00163578 0x801D3178 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x0016357C 0x801D317C 0x00000000 */ .word 0x00000000 # nop
