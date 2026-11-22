#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
u8 D_8016F598(s32 id);
s32 D_801CD19C(s32 a, s32 cls, s32 flag);
s32 func_002379AC(s32 effect, void *record) {
    u8 p = 0;
    s32 r;
    if (((BattleRosterRecord *)record)->field_36 != 0) {
        p = D_8016F598(((BattleRosterRecord *)record)->field_36);
    }
    if (((BattleRosterRecord *)record)->field_38 != 0) {
        p |= D_8016F598(((BattleRosterRecord *)record)->field_38);
    }
    if (((BattleRosterRecord *)record)->field_3A != 0) {
        p |= D_8016F598(((BattleRosterRecord *)record)->field_3A);
    }
    if (((BattleRosterRecord *)record)->field_3C != 0) {
        p |= D_8016F598(((BattleRosterRecord *)record)->field_3C);
    }
    if (D_801CD19C(((BattleRosterRecord *)record)->class48.word, ((BattleRosterRecord *)record)->variant4C.word, 4)) {
        p |= 2;
    }
    if (D_801CD19C(((BattleRosterRecord *)record)->class48.word, ((BattleRosterRecord *)record)->variant4C.word, 8)) {
        p |= 4;
    }
    if (D_801CD19C(((BattleRosterRecord *)record)->class48.word, ((BattleRosterRecord *)record)->variant4C.word, 2)) {
        p |= 8;
    }
    if (D_801CD19C(((BattleRosterRecord *)record)->class48.word, ((BattleRosterRecord *)record)->variant4C.word, 0x10)) {
        p |= 0x20;
    }
    switch ((u32)effect) {
        case 4:
            r = p & 2;
            break;
        case 3:
            r = p & 8;
            break;
        case 8:
            r = p & 4;
            break;
        case 10:
            r = p & 0x20;
            break;
        default:
            return 1;
    }
    if (r != 0) {
        r = 0;
    } else {
        r = 1;
    }
    return r;
}
