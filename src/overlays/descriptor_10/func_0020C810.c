#include "game/battle_record_flag.h"
#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801CE8BC;
extern inline int func_0020C014(void *record) {
    BattleRosterRecord *u = record;

    if (u == ((void *)0)) {
        return 0;
    }
    return ((u->flags40 >> 8) ^ 1) & 1;
}
extern inline int func_0020C0E8(void *record) {
    if (record == 0) {
        return 0;
    }
    return (*(const unsigned int *)((const unsigned char *)record + 0x40) >> 9) & 1;
}
extern inline BattleRosterRecord *BattleGetUnit(u32 i) {
    u8 *base = D_801CE8BC;
    s32 off;
    if (i < 20) {
        off = i * 0xF8;
        if (*(s32 *)(base + off + 0x20C) != 0) {
            return (BattleRosterRecord *)(base + (off + 0x1C4));
        }
    }
    return ((void *)0);
}
BattleRosterRecord *func_0020C810(void) {
    s32 i;
    BattleRosterRecord *u;
    for (i = 0; i < 20; i++) {
        u = BattleGetUnit(i);
        if (func_0020C014(u) && func_0020C0E8(u)) {
            return u;
        }
    }
    return ((void *)0);
}
