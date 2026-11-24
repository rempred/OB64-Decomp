#include "game/battle_roster_types.h"

#include "game/battle_record_flag.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
inline s32 func_0020C2C0(void *u) {
    if (u == ((void *)0)) {
        return 1;
    }
    return (((BattleRosterRecord *)u)->battle_flags) & 1;
}
