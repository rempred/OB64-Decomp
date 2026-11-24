#include "game/battle_roster_types.h"

typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_801CE8BC;
s32 D_801C8C90(u8 *actor_bytes);
s32 func_002A8DBC(u8 *body) {
    BattleRosterRecord *actor;
    s32 result;
    if (body == ((void *)0) || body[0x147] == 0xFF) {
        return 0;
    }
    actor = (BattleRosterRecord *)(D_801CE8BC + 0x1C4 + body[0x147] * 0xF8);
    if (actor->primary_class_id.word == 0) {
        return 0;
    }
    result = D_801C8C90((u8 *)actor);
    if (result == 1) {
        if (body[0x149] == result) {
            return 2;
        }
        return 1;
    }
    return 0;
}
