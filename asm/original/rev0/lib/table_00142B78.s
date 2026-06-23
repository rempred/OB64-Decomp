/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142B78..0x00142BA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 10 RAM pointers in the 0x801C821C..0x801C82CC band (0x801C82CC, 0x801C82BC, 0x801C821C). Word-stride pointer table. [name-token: table_ptr_801C82xx]. */
/* 0x00142B78 0x801B2778 0x801C82CC */ .word 0x801C82CC # lb $gp, -0x7D34($zero)
/* 0x00142B7C 0x801B277C 0x801C82BC */ .word 0x801C82BC # lb $gp, -0x7D44($zero)
/* 0x00142B80 0x801B2780 0x801C821C */ .word 0x801C821C # lb $gp, -0x7DE4($zero)
/* 0x00142B84 0x801B2784 0x801C822C */ .word 0x801C822C # lb $gp, -0x7DD4($zero)
/* 0x00142B88 0x801B2788 0x801C823C */ .word 0x801C823C # lb $gp, -0x7DC4($zero)
/* 0x00142B8C 0x801B278C 0x801C824C */ .word 0x801C824C # lb $gp, -0x7DB4($zero)
/* 0x00142B90 0x801B2790 0x801C825C */ .word 0x801C825C # lb $gp, -0x7DA4($zero)
/* 0x00142B94 0x801B2794 0x801C82BC */ .word 0x801C82BC # lb $gp, -0x7D44($zero)
/* 0x00142B98 0x801B2798 0x801C827C */ .word 0x801C827C # lb $gp, -0x7D84($zero)
/* 0x00142B9C 0x801B279C 0x801C826C */ .word 0x801C826C # lb $gp, -0x7D94($zero)
