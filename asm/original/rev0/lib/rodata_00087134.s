/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x00087134..0x00087154 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): String pool / format fragment: ASCII bytes spanning 0x87134..0x8714F decode to printable runs including 'cScec'/'ne %d' (i.e. a '...Scene %d...' style format string) with surrounding control/format bytes (0x81,0x46,0x25,0x73 = '%s', 0x0E,0x0F). Value type: rodata text/format string.. */
/* 0x00087134 0x800F6D34 0x81460000 */ .word 0x81460000 # lb $a2, 0x0($t2)
/* 0x00087138 0x800F6D38 0x25730000 */ .word 0x25730000 # addiu $s3, $t3, 0x0
/* 0x0008713C 0x800F6D3C 0x0E257310 */ .word 0x0E257310 # jal 0x8895CC40
/* 0x00087140 0x800F6D40 0x63536365 */ .word 0x63536365 # daddi $s3, $k0, 0x6365
/* 0x00087144 0x800F6D44 0x6E652025 */ .word 0x6E652025 # ldr $a1, 0x2025($s3)
/* 0x00087148 0x800F6D48 0x640F0000 */ .word 0x640F0000 # daddiu $t7, $zero, 0x0
/* 0x0008714C 0x800F6D4C 0x0E25730F */ .word 0x0E25730F # jal 0x8895CC3C
/* 0x00087150 0x800F6D50 0x00000000 */ .word 0x00000000 # nop
