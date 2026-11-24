#include "game/battle_predicates.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
/* Keep the argument as the row carrier; a pointer local changes KMC null-branch layout. */
s32 func_0020C1B4(void *u) {
    s32 c;
    s32 r;
    if (u == ((void *)0)) {
        return 0;
    }
    c = ((BattleRosterRecord *)u)->secondary_class_id.word;
    r = 0;
    if ((u32)(c - 45) < 2 || c == 47) {
        r = 1;
    } else if (c == 48) {
        r = 1;
    }
    return r;
}
