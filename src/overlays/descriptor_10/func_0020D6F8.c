#include "game/battle_predicates.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern inline s32 battle_actor_is_side_one(void *record) {
    BattleRosterRecord *u = record;

    if (u == ((void *)0)) {
        return 0;
    }
    return (u->battle_flags >> 8) & 1;
}
s32 func_0020D6F8(void *first, void *second) {
    BattleRosterRecord *a = first;
    BattleRosterRecord *b = second;
    s32 r = a->formation_column > b->formation_column;
    if (battle_actor_is_side_one(a)) {
        r = !r;
    }
    return r;
}
