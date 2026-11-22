#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
u16 D_801C8FB8(void *record);
s32 D_8016F580(s32 id);
u8 D_8016F598(s32 id);
s32 D_801CD19C(s32 a, s32 cls, s32 flag);
s32 func_00237890(void *source, void *target) {
    u8 inflict;
    u8 protect;
    u16 id = D_801C8FB8(source);
    inflict = 0;
    protect = 0;
    if (id != 0) {
        inflict = D_8016F580((u16)id);
    }
    if (((BattleRosterRecord *)target)->field_36 != 0) {
        protect = D_8016F598(((BattleRosterRecord *)target)->field_36);
    }
    if (((BattleRosterRecord *)target)->field_38 != 0) {
        protect |= D_8016F598(((BattleRosterRecord *)target)->field_38);
    }
    if (((BattleRosterRecord *)target)->field_3A != 0) {
        protect |= D_8016F598(((BattleRosterRecord *)target)->field_3A);
    }
    if (((BattleRosterRecord *)target)->field_3C != 0) {
        protect |= D_8016F598(((BattleRosterRecord *)target)->field_3C);
    }
    if (D_801CD19C(((BattleRosterRecord *)target)->class48.word, ((BattleRosterRecord *)target)->variant4C.word, 4)) {
        protect |= 2;
    }
    if (D_801CD19C(((BattleRosterRecord *)target)->class48.word, ((BattleRosterRecord *)target)->variant4C.word, 8)) {
        protect |= 4;
    }
    if (D_801CD19C(((BattleRosterRecord *)target)->class48.word, ((BattleRosterRecord *)target)->variant4C.word, 2)) {
        protect |= 8;
    }
    if (D_801CD19C(((BattleRosterRecord *)target)->class48.word, ((BattleRosterRecord *)target)->variant4C.word, 0x10)) {
        protect |= 0x20;
    }
    inflict &= ~protect;
    return inflict;
}
