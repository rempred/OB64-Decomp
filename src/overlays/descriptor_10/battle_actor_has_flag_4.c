#include "game/battle_predicates.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
s32 battle_actor_has_flag_4(void *record) {
    BattleRosterRecord *u = record;
    if (u == ((void *)0)) {
        return 0;
    }
    return (u->battle_flags >> 4) & 1;
}
