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
s32 func_00235DC8(BattleUnit *a, BattleUnit *b);
s8 D_8016F6FC(u16 id);
s8 D_8016F74C(u16 id);
extern inline s8 ItemBonus6FC(u16 id) { return id != 0 ? D_8016F6FC(id) : 0; }
extern inline s16 BattleUnitItemSum6FC(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus6FC(u->equipment_slot_0); if (u->equipment_slot_1 != 0) { s += D_8016F6FC(u->equipment_slot_1); } if (u->equipment_slot_2 != 0) { s += D_8016F6FC(u->equipment_slot_2); } return u->equipment_slot_3 != 0 ? s + D_8016F6FC(u->equipment_slot_3) : s; }
extern inline s8 ItemBonus74C(u16 id) { return id != 0 ? D_8016F74C(id) : 0; }
extern inline s16 BattleUnitItemSum74C(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus74C(u->equipment_slot_0); if (u->equipment_slot_1 != 0) { s += D_8016F74C(u->equipment_slot_1); } if (u->equipment_slot_2 != 0) { s += D_8016F74C(u->equipment_slot_2); } return u->equipment_slot_3 != 0 ? s + D_8016F74C(u->equipment_slot_3) : s; }
f32 func_002351D4(BattleUnit *a, BattleUnit *b);
unsigned char D_8016D350(int, int);
f32 func_002351D4(BattleUnit *a, BattleUnit *b);
s32 func_00235DC8(BattleUnit *a, BattleUnit *b) {
    u8 base = (unsigned char)D_8016D350((unsigned char)(a->primary_class_id.word),(unsigned char)(a->secondary_class_id.word));
    f32 p;
    p = (f32)(base + BattleUnitItemSum6FC(a)) / 6.0f;
    p *= (f32)(a->intelligence + 50) / 50.0f;
    p *= (f32)(a->mentality + BattleUnitItemSum74C(a) + 100) / 100.0f;
    p *= (func_002351D4(a, b) + 100.0f) / 100.0f;
    return p;
}
