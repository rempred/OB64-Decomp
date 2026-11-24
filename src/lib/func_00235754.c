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
u16 D_801C8FB8(BattleUnit *u);
s32 func_00235754(BattleUnit *a, BattleUnit *b);
unsigned char D_8016D2FC(int, int);
s8 D_8016F65C(u16 id);
s8 D_8016F7EC(u16 id);
int D_8016F9F0(int);
f32 func_00234B54(BattleUnit *a, BattleUnit *b);
extern inline s8 ItemBonus7EC(u16 id) { return id != 0 ? D_8016F7EC(id) : 0; }
extern inline s16 BattleUnitItemSum7EC(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus7EC(u->equipment_slot_0); if (u->equipment_slot_1 != 0) { s += D_8016F7EC(u->equipment_slot_1); } if (u->equipment_slot_2 != 0) { s += D_8016F7EC(u->equipment_slot_2); } return u->equipment_slot_3 != 0 ? s + D_8016F7EC(u->equipment_slot_3) : s; }
f32 func_00234B54(BattleUnit *a, BattleUnit *b);
extern inline s16 WeaponBonus2(BattleUnit *u) {
    u16 id;
    if (u == ((void *)0)) {
        return 0;
    }
    id = D_801C8FB8(u);
    return id != 0 ? D_8016F65C(id) : 0;
}
extern inline s16 ArmorSum65C(BattleUnit *a) {
    s16 s;
    if (!D_8016F9F0((unsigned short)(a->equipment_slot_0))) {
        s = D_8016F65C(a->equipment_slot_0);
    } else {
        s = 0;
    }
    if (!D_8016F9F0((unsigned short)(a->equipment_slot_1))) {
        s += D_8016F65C(a->equipment_slot_1);
    }
    if (!D_8016F9F0((unsigned short)(a->equipment_slot_2))) {
        s += D_8016F65C(a->equipment_slot_2);
    }
    return !D_8016F9F0((unsigned short)(a->equipment_slot_3)) ? s + D_8016F65C(a->equipment_slot_3) : s;
}
s32 func_00235754(BattleUnit *a, BattleUnit *b) {
    u8 base = D_8016D2FC((unsigned char)(a->primary_class_id.word),(unsigned char)(a->secondary_class_id.word));
    f32 p;
    p = (f32)(base + WeaponBonus2(a)) / 6.0f;
    p *= (f32)(a->strength + ArmorSum65C(a) + 50) / 50.0f;
    p *= (f32)(a->dexterity + BattleUnitItemSum7EC(a) + 100) / 100.0f;
    p *= (func_00234B54(a, b) + 100.0f) / 100.0f;
    return p;
}
