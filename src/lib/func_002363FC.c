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
s8 D_8016F7EC(u16 id);
s8 D_8016F79C(u16 id);
extern inline s8 ItemBonus79C(u16 id) { return id != 0 ? D_8016F79C(id) : 0; }
extern inline s16 BattleUnitItemSum79C(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus79C(u->equipment_slot_0); if (u->equipment_slot_1 != 0) { s += D_8016F79C(u->equipment_slot_1); } if (u->equipment_slot_2 != 0) { s += D_8016F79C(u->equipment_slot_2); } return u->equipment_slot_3 != 0 ? s + D_8016F79C(u->equipment_slot_3) : s; }
extern inline s8 ItemBonus7EC(u16 id) { return id != 0 ? D_8016F7EC(id) : 0; }
extern inline s16 BattleUnitItemSum7EC(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus7EC(u->equipment_slot_0); if (u->equipment_slot_1 != 0) { s += D_8016F7EC(u->equipment_slot_1); } if (u->equipment_slot_2 != 0) { s += D_8016F7EC(u->equipment_slot_2); } return u->equipment_slot_3 != 0 ? s + D_8016F7EC(u->equipment_slot_3) : s; }
f32 func_00235610(BattleUnit *u);
f32 func_00235610(BattleUnit *u);
s32 func_002363FC(BattleUnit *u) {
    f32 p = u->agility + BattleUnitItemSum79C(u) + 50;
    p *= (f32)(u->dexterity + BattleUnitItemSum7EC(u) + 100) / 50.0f;
    p *= (func_00235610(u) + 100.0f) / 100.0f;
    return p;
}
