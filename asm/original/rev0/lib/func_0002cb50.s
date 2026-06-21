/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002CB50..0x0002CB80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002CB50 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0002cb50:
/* 0x0002CB50 0x8009C750 0x4600610D */ .word 0x4600610D # trunc.w.s $f4, $f12
/* 0x0002CB54 0x8009C754 0x460062A1 */ .word 0x460062A1 # cvt.d.s $f10, $f12
/* 0x0002CB58 0x8009C758 0x440F2000 */ .word 0x440F2000 # mfc1 $t7, $f4
/* 0x0002CB5C 0x8009C75C 0x00000000 */ .word 0x00000000 # nop
/* 0x0002CB60 0x8009C760 0x448F3000 */ .word 0x448F3000 # mtc1 $t7, $f6
/* 0x0002CB64 0x8009C764 0x00000000 */ .word 0x00000000 # nop
/* 0x0002CB68 0x8009C768 0x468030A1 */ .word 0x468030A1 # cvt.d.w $f2, $f6
/* 0x0002CB6C 0x8009C76C 0x46201220 */ .word 0x46201220 # cvt.s.d $f8, $f2
/* 0x0002CB70 0x8009C770 0x46225401 */ .word 0x46225401 # sub.d $f16, $f10, $f2
/* 0x0002CB74 0x8009C774 0xE4A80000 */ .word 0xE4A80000 # swc1 $f8, 0x0($a1)
/* 0x0002CB78 0x8009C778 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002CB7C 0x8009C77C 0x46208020 */ .word 0x46208020 # cvt.s.d $f0, $f16
