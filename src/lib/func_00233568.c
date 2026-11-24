#include "game/battle_roster_record.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

u16 D_801C8FB8(void *u);
s32 D_8016F5E0(s32 a);
s32 D_8016FB50(u16 a, u16 b, u16 c, u16 d);
int func_00233568(void *record) {
    BattleRosterRecord *u = record;
    s32 r;
    s32 k;
    r = (u16)D_8016FB50(u->equipment_slot_0, u->equipment_slot_1, u->equipment_slot_2, u->equipment_slot_3);
    if (r == 0) {
        r = D_801C8FB8(u);
        if (r == 0) {
            goto none;
        }
    }
    k = D_8016F5E0((u16)r);
    if ((u8)k == 8) {
    none:
        k = u->element;
    }
    return (u8)k;
}
