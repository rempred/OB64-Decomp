#include "game/battle_roster_types.h"

typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;

s32 battle_actor_has_flag_2(void *record) {
    if (record == ((void *)0)) {
        return 0;
    }
    return (((const BattleRosterRecord *)record)->battle_flags >> 2) & 1;
}
