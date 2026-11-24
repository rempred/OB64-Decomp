typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct BattleObj {
    u8 unk00[0x18];
    s32 unk18;
    u8 unk1C[0x28];
    s32 unk44;
} BattleObj;
#include "game/battle_roster_types.h"
typedef BattleRosterRecord BattleUnit;
s32 D_801C8B84(BattleUnit *u);
s32 D_801C8E64(BattleUnit *u);
s32 D_801C8E80(BattleUnit *u);
s32 D_801C8E9C(BattleUnit *u);
s32 D_801C8B68(BattleUnit *u);
signed char D_8016F644(int);
extern inline s8 ItemBonus644(u16 id) { return id != 0 ? (signed char)D_8016F644((unsigned short)(id)) : 0; }
extern inline s16 BattleUnitItemSum644(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus644(u->equipment_slot_0); if (u->equipment_slot_1 != 0) { s += (signed char)D_8016F644((unsigned short)(u->equipment_slot_1)); } if (u->equipment_slot_2 != 0) { s += (signed char)D_8016F644((unsigned short)(u->equipment_slot_2)); } return u->equipment_slot_3 != 0 ? s + (signed char)D_8016F644((unsigned short)(u->equipment_slot_3)) : s; }
s32 D_801C8C74(BattleUnit *u);
s32 D_801C8C74(BattleUnit *u);
int D_8016FEF4(signed short);
s32 func_002365BC(BattleUnit *a, BattleUnit *b, s32 num, s32 den) {
    s32 p;
    s32 da;
    if (D_801C8E9C(b) != 0 || D_801C8E80(b) != 0 || D_801C8E64(b) != 0) {
        return 100;
    }
    if (D_801C8C74(b) != 0) {
        return 100;
    }
    da = a->luck + BattleUnitItemSum644(a);
    p = (f32)num / (f32)den * (f32)(da - (b->luck + BattleUnitItemSum644(b)) + 100);
    if (D_801C8B84(a) != 0) {
        p += 10;
    }
    if (p < 0) {
        p = 0;
    }
    if (p > 100) {
        p = 100;
    }
    if (D_8016FEF4(0xB2) != 0 && D_801C8B84(a) != 0) {
        return 100;
    }
    if (D_8016FEF4(0xB2) != 0) {
        if (D_801C8B68(a) != 0) {
            return 0;
        }
    }
    return p;
}
