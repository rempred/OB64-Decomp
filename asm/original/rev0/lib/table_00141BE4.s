/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00141BE4..0x00141C80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small-integer record table. Repeating 3-word groups where the first word is a small opcode/size byte and the next two words are 0x00000002/0x00000003: e.g. 0x0000001C,0x00000000,0x00000001 then 0x0000001D,0x00000002,0x00000003; 0x00000023,2,3; 0x0000002F,2,3; 0x00000035,2,3; 0x00000055,2,3; 0x00000056,2,3; 0x00000065,2,3; 0x00000073,2,3; 0x0000007C,2,3; 0x0000007D,2,3; 0x00000080,2,3. Values are tiny enums/counts, no pointers, no floats. Hypothesis (marked): a {tag, lo, hi} or {id,min,max} parameter table, ~12 records of stride 0x0C. [name-token: table_00141BE4_smallints]. */
/* 0x00141BE4 0x801B17E4 0x0000001C */ .word 0x0000001C # dmult $zero, $zero
/* 0x00141BE8 0x801B17E8 0x00000000 */ .word 0x00000000 # nop
/* 0x00141BEC 0x801B17EC 0x00000001 */ .word 0x00000001 # special_0x01
/* 0x00141BF0 0x801B17F0 0x0000001D */ .word 0x0000001D # dmultu $zero, $zero
/* 0x00141BF4 0x801B17F4 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141BF8 0x801B17F8 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141BFC 0x801B17FC 0x0000001E */ .word 0x0000001E # ddiv $zero, $zero
/* 0x00141C00 0x801B1800 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C04 0x801B1804 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C08 0x801B1808 0x00000023 */ .word 0x00000023 # subu $zero, $zero, $zero
/* 0x00141C0C 0x801B180C 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C10 0x801B1810 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C14 0x801B1814 0x0000002F */ .word 0x0000002F # dsubu $zero, $zero, $zero
/* 0x00141C18 0x801B1818 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C1C 0x801B181C 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C20 0x801B1820 0x00000035 */ .word 0x00000035 # special_0x35
/* 0x00141C24 0x801B1824 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C28 0x801B1828 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C2C 0x801B182C 0x00000055 */ .word 0x00000055 # special_0x15
/* 0x00141C30 0x801B1830 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C34 0x801B1834 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C38 0x801B1838 0x00000056 */ .word 0x00000056 # dsrlv $zero, $zero, $zero
/* 0x00141C3C 0x801B183C 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C40 0x801B1840 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C44 0x801B1844 0x00000065 */ .word 0x00000065 # move $zero, $zero
/* 0x00141C48 0x801B1848 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C4C 0x801B184C 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C50 0x801B1850 0x00000073 */ .word 0x00000073 # tltu $zero, $zero
/* 0x00141C54 0x801B1854 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C58 0x801B1858 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C5C 0x801B185C 0x0000007C */ .word 0x0000007C # dsll32 $zero, $zero, 1
/* 0x00141C60 0x801B1860 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C64 0x801B1864 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C68 0x801B1868 0x0000007D */ .word 0x0000007D # special_0x3D
/* 0x00141C6C 0x801B186C 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C70 0x801B1870 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x00141C74 0x801B1874 0x00000080 */ .word 0x00000080 # sll $zero, $zero, 2
/* 0x00141C78 0x801B1878 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x00141C7C 0x801B187C 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
