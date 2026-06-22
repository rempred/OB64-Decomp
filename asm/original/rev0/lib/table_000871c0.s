/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x000871C0..0x00087200 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Pointer table: 15 RAM pointers 0x801A575C,0x801A5750,0x801A5744,0x801A576C,... into the 0x801A57xx region (note repeated 0x801A576C used as a default/fill entry). Terminated by a single 0x00000000 word at 0x871FC (the nop/terminator immediately before code resumes at 0x87200), included here as the table terminator. Value type: RAM pointers (0x80xxxxxx).. */
/* 0x000871C0 0x800F6DC0 0x801A575C */ .word 0x801A575C # lb $k0, 0x575C($zero)
/* 0x000871C4 0x800F6DC4 0x801A5750 */ .word 0x801A5750 # lb $k0, 0x5750($zero)
/* 0x000871C8 0x800F6DC8 0x801A5744 */ .word 0x801A5744 # lb $k0, 0x5744($zero)
/* 0x000871CC 0x800F6DCC 0x801A576C */ .word 0x801A576C # lb $k0, 0x576C($zero)
/* 0x000871D0 0x800F6DD0 0x801A5738 */ .word 0x801A5738 # lb $k0, 0x5738($zero)
/* 0x000871D4 0x800F6DD4 0x801A576C */ .word 0x801A576C # lb $k0, 0x576C($zero)
/* 0x000871D8 0x800F6DD8 0x801A572C */ .word 0x801A572C # lb $k0, 0x572C($zero)
/* 0x000871DC 0x800F6DDC 0x801A576C */ .word 0x801A576C # lb $k0, 0x576C($zero)
/* 0x000871E0 0x800F6DE0 0x801A576C */ .word 0x801A576C # lb $k0, 0x576C($zero)
/* 0x000871E4 0x800F6DE4 0x801A5720 */ .word 0x801A5720 # lb $k0, 0x5720($zero)
/* 0x000871E8 0x800F6DE8 0x801A5714 */ .word 0x801A5714 # lb $k0, 0x5714($zero)
/* 0x000871EC 0x800F6DEC 0x801A576C */ .word 0x801A576C # lb $k0, 0x576C($zero)
/* 0x000871F0 0x800F6DF0 0x801A576C */ .word 0x801A576C # lb $k0, 0x576C($zero)
/* 0x000871F4 0x800F6DF4 0x801A576C */ .word 0x801A576C # lb $k0, 0x576C($zero)
/* 0x000871F8 0x800F6DF8 0x801A5708 */ .word 0x801A5708 # lb $k0, 0x5708($zero)
/* 0x000871FC 0x800F6DFC 0x00000000 */ .word 0x00000000 # nop
