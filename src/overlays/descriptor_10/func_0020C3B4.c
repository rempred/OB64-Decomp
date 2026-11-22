#include "game/battle_predicates.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
u8 func_00195410_helper(s32 id);
/* Keep the argument as the row carrier; a pointer local enlarges the KMC frame. */
s32 func_0020C3B4(void *u) {
    s32 r;
    if ((u8)(func_00195410_helper(((BattleRosterRecord *)u)->field_36) - 14) < 2) {
        r = 1;
    } else if ((u8)(func_00195410_helper(((BattleRosterRecord *)u)->field_38) - 14) < 2) {
        r = 1;
    } else if ((u8)(func_00195410_helper(((BattleRosterRecord *)u)->field_3A) - 14) < 2) {
        r = 1;
    } else {
        r = (u8)(func_00195410_helper(((BattleRosterRecord *)u)->field_3C) - 14) < 2;
    }
    return r;
}
