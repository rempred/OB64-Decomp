#include "game/battle_predicates.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern inline s32 func_0020BFF8(void *record) {
    BattleRosterRecord *u = record;

    if (u == ((void *)0)) {
        return 0;
    }
    return (u->flags40 >> 8) & 1;
}
s32 func_0020D6F8(void *first, void *second) {
    BattleRosterRecord *a = first;
    BattleRosterRecord *b = second;
    s32 r = a->column54 > b->column54;
    if (func_0020BFF8(a)) {
        r = !r;
    }
    return r;
}
