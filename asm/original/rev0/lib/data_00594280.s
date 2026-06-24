/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00591000_005A1000.s
 * z64 range: 0x00594280..0x00594384 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Section C resource-pool DIRECTORY: a 65-entry u32-BE offset table (0x594280..0x594384, 0x104 B). 3-word prelude (0x64C2, 0x140, 0x148) then a largely-monotonic offset list 0x63DC..0x27C5F4 (max 0x27C5F4 ~2.6 MB EXCEEDS the raw-ROM Section C span -> the offsets index the DECOMPRESSED Section C asset space). The table-of-contents for the HUFFMAN-compressed Section C pool. raw-but-classified (table shape decoded; per-entry asset/decompressed-offset semantics unresolved).. */
/* 0x00594280 0x80603E80 0x000064C2 */ .word 0x000064C2 # srl $t4, $zero, 19
/* 0x00594284 0x80603E84 0x00000140 */ .word 0x00000140 # sll $zero, $zero, 5
/* 0x00594288 0x80603E88 0x00000148 */ .word 0x00000148 # jr $zero
/* 0x0059428C 0x80603E8C 0x000063DC */ .word 0x000063DC # dmult $zero, $zero
/* 0x00594290 0x80603E90 0x0000CBB4 */ .word 0x0000CBB4 # teq $zero, $zero
/* 0x00594294 0x80603E94 0x000135F0 */ .word 0x000135F0 # tge $zero, $at
/* 0x00594298 0x80603E98 0x00019FF0 */ .word 0x00019FF0 # tge $zero, $at
/* 0x0059429C 0x80603E9C 0x0001EE64 */ .word 0x0001EE64 # and $sp, $zero, $at
/* 0x005942A0 0x80603EA0 0x0002507C */ .word 0x0002507C # dsll32 $t2, $v0, 1
/* 0x005942A4 0x80603EA4 0x0002A5C4 */ .word 0x0002A5C4 # sllv $s4, $v0, $zero
/* 0x005942A8 0x80603EA8 0x0002F76C */ .word 0x0002F76C # dadd $s8, $zero, $v0
/* 0x005942AC 0x80603EAC 0x000353CC */ .word 0x000353CC # syscall 0x00D4F
/* 0x005942B0 0x80603EB0 0x0003AACC */ .word 0x0003AACC # syscall 0x00EAB
/* 0x005942B4 0x80603EB4 0x000404A0 */ .word 0x000404A0 # add $zero, $zero, $a0
/* 0x005942B8 0x80603EB8 0x00046444 */ .word 0x00046444 # sllv $t4, $a0, $zero
/* 0x005942BC 0x80603EBC 0x0004B12C */ .word 0x0004B12C # dadd $s6, $zero, $a0
/* 0x005942C0 0x80603EC0 0x00050378 */ .word 0x00050378 # dsll $zero, $a1, 13
/* 0x005942C4 0x80603EC4 0x00055F10 */ .word 0x00055F10 # mfhi $t3
/* 0x005942C8 0x80603EC8 0x0005B574 */ .word 0x0005B574 # teq $zero, $a1
/* 0x005942CC 0x80603ECC 0x00060E30 */ .word 0x00060E30 # tge $zero, $a2
/* 0x005942D0 0x80603ED0 0x0006672C */ .word 0x0006672C # dadd $t4, $zero, $a2
/* 0x005942D4 0x80603ED4 0x0006D2C4 */ .word 0x0006D2C4 # sllv $k0, $a2, $zero
/* 0x005942D8 0x80603ED8 0x00073BF0 */ .word 0x00073BF0 # tge $zero, $a3
/* 0x005942DC 0x80603EDC 0x00079B24 */ .word 0x00079B24 # and $s3, $zero, $a3
/* 0x005942E0 0x80603EE0 0x0007F310 */ .word 0x0007F310 # mfhi $s8
/* 0x005942E4 0x80603EE4 0x00083F68 */ .word 0x00083F68 # special_0x28
/* 0x005942E8 0x80603EE8 0x00088E14 */ .word 0x00088E14 # dsllv $s1, $t0, $zero
/* 0x005942EC 0x80603EEC 0x0008E548 */ .word 0x0008E548 # jr $zero
/* 0x005942F0 0x80603EF0 0x000935D4 */ .word 0x000935D4 # dsllv $a2, $t1, $zero
/* 0x005942F4 0x80603EF4 0x00098294 */ .word 0x00098294 # dsllv $s0, $t1, $zero
/* 0x005942F8 0x80603EF8 0x0009C938 */ .word 0x0009C938 # dsll $t9, $t1, 4
/* 0x005942FC 0x80603EFC 0x000A2500 */ .word 0x000A2500 # sll $a0, $t2, 20
/* 0x00594300 0x80603F00 0x000B5DC8 */ .word 0x000B5DC8 # jr $zero
/* 0x00594304 0x80603F04 0x000C9A42 */ .word 0x000C9A42 # srl $s3, $t4, 9
/* 0x00594308 0x80603F08 0x000C9A42 */ .word 0x000C9A42 # srl $s3, $t4, 9
/* 0x0059430C 0x80603F0C 0x000C9A42 */ .word 0x000C9A42 # srl $s3, $t4, 9
/* 0x00594310 0x80603F10 0x000D62F6 */ .word 0x000D62F6 # tne $zero, $t5
/* 0x00594314 0x80603F14 0x000DCC46 */ .word 0x000DCC46 # srlv $t9, $t5, $zero
/* 0x00594318 0x80603F18 0x000EECD0 */ .word 0x000EECD0 # mfhi $sp
/* 0x0059431C 0x80603F1C 0x000F5E8C */ .word 0x000F5E8C # syscall 0x03D7A
/* 0x00594320 0x80603F20 0x0010595A */ .word 0x0010595A # div $zero, $s0
/* 0x00594324 0x80603F24 0x0011C530 */ .word 0x0011C530 # tge $zero, $s1
/* 0x00594328 0x80603F28 0x00130C34 */ .word 0x00130C34 # teq $zero, $s3
/* 0x0059432C 0x80603F2C 0x0013D472 */ .word 0x0013D472 # tlt $zero, $s3
/* 0x00594330 0x80603F30 0x000EECD0 */ .word 0x000EECD0 # mfhi $sp
/* 0x00594334 0x80603F34 0x0014DE06 */ .word 0x0014DE06 # srlv $k1, $s4, $zero
/* 0x00594338 0x80603F38 0x001550AE */ .word 0x001550AE # dsub $t2, $zero, $s5
/* 0x0059433C 0x80603F3C 0x0010595A */ .word 0x0010595A # div $zero, $s0
/* 0x00594340 0x80603F40 0x0009C938 */ .word 0x0009C938 # dsll $t9, $t1, 4
/* 0x00594344 0x80603F44 0x0016804E */ .word 0x0016804E # special_0x0E
/* 0x00594348 0x80603F48 0x001760F2 */ .word 0x001760F2 # tlt $zero, $s7
/* 0x0059434C 0x80603F4C 0x00183352 */ .word 0x00183352 # mflo $a2
/* 0x00594350 0x80603F50 0x00188E36 */ .word 0x00188E36 # tne $zero, $t8
/* 0x00594354 0x80603F54 0x00197A72 */ .word 0x00197A72 # tlt $zero, $t9
/* 0x00594358 0x80603F58 0x001C03A0 */ .word 0x001C03A0 # add $zero, $zero, $gp
/* 0x0059435C 0x80603F5C 0x001CAFC4 */ .word 0x001CAFC4 # sllv $s5, $gp, $zero
/* 0x00594360 0x80603F60 0x001FCD04 */ .word 0x001FCD04 # sllv $t9, $ra, $zero
/* 0x00594364 0x80603F64 0x00208510 */ .word 0x00208510 # mfhi $s0
/* 0x00594368 0x80603F68 0x00214344 */ .word 0x00214344 # sllv $t0, $at, $at
/* 0x0059436C 0x80603F6C 0x00236B58 */ .word 0x00236B58 # mult $at, $v1
/* 0x00594370 0x80603F70 0x0024714C */ .word 0x0024714C # syscall 0x091C5
/* 0x00594374 0x80603F74 0x00254AA8 */ .word 0x00254AA8 # special_0x28
/* 0x00594378 0x80603F78 0x0025DEB4 */ .word 0x0025DEB4 # teq $at, $a1
/* 0x0059437C 0x80603F7C 0x0026CA20 */ .word 0x0026CA20 # add $t9, $at, $a2
/* 0x00594380 0x80603F80 0x0027C5F4 */ .word 0x0027C5F4 # teq $at, $a3
