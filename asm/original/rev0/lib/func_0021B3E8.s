/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021B3E8..0x0021B438 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf (plan missed). Read-before-write $a0 (addiu $a0,$a0,-0x1 at 0x0021B3E8), bounds-check sltiu $a0,0x3C, jump-table dispatch lui $at,0x801E;lw $v0,0x67E0($at);jr $v0 at 0x0021B400-0x0021B404 (internal), case arms j 0x801D8160 + delay, default addiu $v0,5 then jr $ra at 0x0021B430 + delay nop at 0x0021B434. State->value mapping helper. Ends at 0x0021B438 (next prologue). */
/* 0x0021B3E8 0x8028AFE8 0x2484FFFF */ .word 0x2484FFFF # addiu $a0, $a0, -0x1
/* 0x0021B3EC 0x8028AFEC 0x2C82003C */ .word 0x2C82003C # sltiu $v0, $a0, 0x3C
/* 0x0021B3F0 0x8028AFF0 0x1040000E */ .word 0x1040000E # beq $v0, $zero, 0x8028B02C
/* 0x0021B3F4 0x8028AFF4 0x00041080 */ .word 0x00041080 # sll $v0, $a0, 2
/* 0x0021B3F8 0x8028AFF8 0x3C01801E */ .word 0x3C01801E # lui $at, 0x801E
/* 0x0021B3FC 0x8028AFFC 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x0021B400 0x8028B000 0x8C2267E0 */ .word 0x8C2267E0 # lw $v0, 0x67E0($at)
/* 0x0021B404 0x8028B004 0x00400008 */ .word 0x00400008 # jr $v0
/* 0x0021B408 0x8028B008 0x00000000 */ .word 0x00000000 # nop
/* 0x0021B40C 0x8028B00C 0x08076058 */ .word 0x08076058 # j 0x801D8160
/* 0x0021B410 0x8028B010 0x2402000A */ .word 0x2402000A # addiu $v0, $zero, 0xA
/* 0x0021B414 0x8028B014 0x08076058 */ .word 0x08076058 # j 0x801D8160
/* 0x0021B418 0x8028B018 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0021B41C 0x8028B01C 0x08076058 */ .word 0x08076058 # j 0x801D8160
/* 0x0021B420 0x8028B020 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0021B424 0x8028B024 0x08076058 */ .word 0x08076058 # j 0x801D8160
/* 0x0021B428 0x8028B028 0x24020014 */ .word 0x24020014 # addiu $v0, $zero, 0x14
/* 0x0021B42C 0x8028B02C 0x24020005 */ .word 0x24020005 # addiu $v0, $zero, 0x5
/* 0x0021B430 0x8028B030 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021B434 0x8028B034 0x00000000 */ .word 0x00000000 # nop
