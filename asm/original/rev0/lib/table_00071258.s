/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00071258..0x00071280 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 10-word RAM-pointer table. All ten values are 0x80xxxxxx RAM pointers into the 0x80197Cxx region: 0x80197C38, 0x80197C44, 0x80197C4C, 0x80197C5C, 0x80197C6C, 0x80197C84, 0x80197C9C, 0x80197CA4, 0x80197D04, 0x80197CEC. Values are not monotonic at the end (last two are 0x80197D04 then 0x80197CEC), consistent with an index/jump pointer table rather than a sorted offset list. Code begins at 0x71280.. */
/* 0x00071258 0x800E0E58 0x80197C38 */ .word 0x80197C38 # lb $t9, 0x7C38($zero)
/* 0x0007125C 0x800E0E5C 0x80197C44 */ .word 0x80197C44 # lb $t9, 0x7C44($zero)
/* 0x00071260 0x800E0E60 0x80197C4C */ .word 0x80197C4C # lb $t9, 0x7C4C($zero)
/* 0x00071264 0x800E0E64 0x80197C5C */ .word 0x80197C5C # lb $t9, 0x7C5C($zero)
/* 0x00071268 0x800E0E68 0x80197C6C */ .word 0x80197C6C # lb $t9, 0x7C6C($zero)
/* 0x0007126C 0x800E0E6C 0x80197C84 */ .word 0x80197C84 # lb $t9, 0x7C84($zero)
/* 0x00071270 0x800E0E70 0x80197C9C */ .word 0x80197C9C # lb $t9, 0x7C9C($zero)
/* 0x00071274 0x800E0E74 0x80197CA4 */ .word 0x80197CA4 # lb $t9, 0x7CA4($zero)
/* 0x00071278 0x800E0E78 0x80197D04 */ .word 0x80197D04 # lb $t9, 0x7D04($zero)
/* 0x0007127C 0x800E0E7C 0x80197CEC */ .word 0x80197CEC # lb $t9, 0x7CEC($zero)
