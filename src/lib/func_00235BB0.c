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
s32 func_00235BB0(BattleUnit *a, BattleUnit *b);
unsigned char D_8016D2FC(int, int);
s8 D_8016F6AC(u16 id);
s8 D_8016F7EC(u16 id);
f32 func_00234B54(BattleUnit *a, BattleUnit *b);
extern inline s8 ItemBonus6AC(u16 id) { return id != 0 ? D_8016F6AC(id) : 0; }
extern inline s16 BattleUnitItemSum6AC(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus6AC(u->equipment_slot_0); if (u->equipment_slot_1 != 0) { s += D_8016F6AC(u->equipment_slot_1); } if (u->equipment_slot_2 != 0) { s += D_8016F6AC(u->equipment_slot_2); } return u->equipment_slot_3 != 0 ? s + D_8016F6AC(u->equipment_slot_3) : s; }
extern inline s8 ItemBonus7EC(u16 id) { return id != 0 ? D_8016F7EC(id) : 0; }
extern inline s16 BattleUnitItemSum7EC(BattleUnit *u) { s16 s; if (u == ((void *)0)) { return 0; } s = ItemBonus7EC(u->equipment_slot_0); if (u->equipment_slot_1 != 0) { s += D_8016F7EC(u->equipment_slot_1); } if (u->equipment_slot_2 != 0) { s += D_8016F7EC(u->equipment_slot_2); } return u->equipment_slot_3 != 0 ? s + D_8016F7EC(u->equipment_slot_3) : s; }
f32 func_00234B54(BattleUnit *a, BattleUnit *b);
s32 func_00235BB0(BattleUnit *a, BattleUnit *b) {
    u8 base = D_8016D2FC((unsigned char)(a->primary_class_id.word),(unsigned char)(a->secondary_class_id.word));
    f32 p;
    p = (f32)(base + BattleUnitItemSum7EC(a)) / 6.0f;
    p *= (f32)(a->dexterity + 50) / 50.0f;
    p *= (f32)(a->vitality + BattleUnitItemSum6AC(a) + 100) / 100.0f;
    p *= (func_00234B54(a, b) + 100.0f) / 100.0f;
    return p;
}
