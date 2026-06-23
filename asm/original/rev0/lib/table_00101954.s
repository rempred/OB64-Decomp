/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101954..0x001019D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table interleaved with tiny index words. Pointer values cycle over a small set {0x801B48B4, 0x801B48C4, 0x801B48E4}, each followed by an index word {0x00000004, 0x00000008, 0x0000000C}: e.g. 0x801B48B4/0x04, 0x801B48C4/0x08, 0x801B48E4/0x0C, repeating ~16 times. Pointer/index pairing makes this a dispatch-style RAM-pointer table (hypothesis: 3-entry pointer set selected by index). Overlay caveat applies; genuine 0x801Bxxxx pointers. [name-token: table_00101954_ramptr_indexed]. */
/* 0x00101954 0x80171554 0x801B48B4 */ .word 0x801B48B4 # lb $k1, 0x48B4($zero)
/* 0x00101958 0x80171558 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x0010195C 0x8017155C 0x801B48C4 */ .word 0x801B48C4 # lb $k1, 0x48C4($zero)
/* 0x00101960 0x80171560 0x00000008 */ .word 0x00000008 # jr $zero
/* 0x00101964 0x80171564 0x801B48E4 */ .word 0x801B48E4 # lb $k1, 0x48E4($zero)
/* 0x00101968 0x80171568 0x0000000C */ .word 0x0000000C # syscall 0x00000
/* 0x0010196C 0x8017156C 0x801B48C4 */ .word 0x801B48C4 # lb $k1, 0x48C4($zero)
/* 0x00101970 0x80171570 0x00000008 */ .word 0x00000008 # jr $zero
/* 0x00101974 0x80171574 0x801B48B4 */ .word 0x801B48B4 # lb $k1, 0x48B4($zero)
/* 0x00101978 0x80171578 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x0010197C 0x8017157C 0x801B48E4 */ .word 0x801B48E4 # lb $k1, 0x48E4($zero)
/* 0x00101980 0x80171580 0x0000000C */ .word 0x0000000C # syscall 0x00000
/* 0x00101984 0x80171584 0x801B48E4 */ .word 0x801B48E4 # lb $k1, 0x48E4($zero)
/* 0x00101988 0x80171588 0x0000000C */ .word 0x0000000C # syscall 0x00000
/* 0x0010198C 0x8017158C 0x801B48C4 */ .word 0x801B48C4 # lb $k1, 0x48C4($zero)
/* 0x00101990 0x80171590 0x00000008 */ .word 0x00000008 # jr $zero
/* 0x00101994 0x80171594 0x801B48B4 */ .word 0x801B48B4 # lb $k1, 0x48B4($zero)
/* 0x00101998 0x80171598 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x0010199C 0x8017159C 0x801B48E4 */ .word 0x801B48E4 # lb $k1, 0x48E4($zero)
/* 0x001019A0 0x801715A0 0x0000000C */ .word 0x0000000C # syscall 0x00000
/* 0x001019A4 0x801715A4 0x801B48B4 */ .word 0x801B48B4 # lb $k1, 0x48B4($zero)
/* 0x001019A8 0x801715A8 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x001019AC 0x801715AC 0x801B48C4 */ .word 0x801B48C4 # lb $k1, 0x48C4($zero)
/* 0x001019B0 0x801715B0 0x00000008 */ .word 0x00000008 # jr $zero
/* 0x001019B4 0x801715B4 0x801B48B4 */ .word 0x801B48B4 # lb $k1, 0x48B4($zero)
/* 0x001019B8 0x801715B8 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x001019BC 0x801715BC 0x801B48E4 */ .word 0x801B48E4 # lb $k1, 0x48E4($zero)
/* 0x001019C0 0x801715C0 0x0000000C */ .word 0x0000000C # syscall 0x00000
/* 0x001019C4 0x801715C4 0x801B48C4 */ .word 0x801B48C4 # lb $k1, 0x48C4($zero)
/* 0x001019C8 0x801715C8 0x00000008 */ .word 0x00000008 # jr $zero
/* 0x001019CC 0x801715CC 0x801B48B4 */ .word 0x801B48B4 # lb $k1, 0x48B4($zero)
/* 0x001019D0 0x801715D0 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
