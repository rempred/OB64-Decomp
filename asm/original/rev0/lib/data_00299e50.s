/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x00299E50..0x00299E84 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Mixed packed blob incl. a near-ASCII descending charset run @0x299E58 (bytes 81 86 71 4D / 66 68 67 69 'fhgi' / 65 64 62 ... 5D 51 54 7F) plus binary words; reversed-order char/index table, not a clean string.. */
/* 0x00299E50 0x80309A50 0x000000FB */ .word 0x000000FB # dsra $zero, $zero, 3
/* 0x00299E54 0x80309A54 0x0C0CFFFF */ .word 0x0C0CFFFF # jal 0x8033FFFC
/* 0x00299E58 0x80309A58 0x8186714D */ .word 0x8186714D # lb $a2, 0x714D($t4)
/* 0x00299E5C 0x80309A5C 0x66686769 */ .word 0x66686769 # daddiu $t0, $s3, 0x6769
/* 0x00299E60 0x80309A60 0x7C656462 */ .word 0x7C656462 # op_0x1F
/* 0x00299E64 0x80309A64 0x636A6B6C */ .word 0x636A6B6C # daddi $t2, $k1, 0x6B6C
/* 0x00299E68 0x80309A68 0x8070966F */ .word 0x8070966F # lb $s0, -0x6991($v1)
/* 0x00299E6C 0x80309A6C 0x615F6E6D */ .word 0x615F6E6D # daddi $ra, $t2, 0x6E6D
/* 0x00299E70 0x80309A70 0x5D51547F */ .word 0x5D51547F # bgtzl $t2, 0x8031EC70
/* 0x00299E74 0x80309A74 0x7E7D567A */ .word 0x7E7D567A # op_0x1F
/* 0x00299E78 0x80309A78 0x5E767775 */ .word 0x5E767775 # bgtzl $s3, 0x80327850
/* 0x00299E7C 0x80309A7C 0x7858595B */ .word 0x7858595B # op_0x1E
/* 0x00299E80 0x80309A80 0x5A5C797B */ .word 0x5A5C797B # blezl $s2, 0x80328070
