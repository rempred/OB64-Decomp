#include "game/cutscene_panels.h"
#include "game/battle_predicates.h"
typedef signed long long s64;
typedef unsigned long long u64;
typedef float f32;
typedef double f64;
typedef s32 M2C_UNK;

s32 func_0020BFE4();
s32 func_0020C014(void *);
void *func_0020C478(unsigned int index);
M2C_UNK func_0021AE6C(f32, M2C_UNK);

extern u8 *D_801CE8BC;
extern s32 D_801CE8C4;
extern u16 D_80190EBC[];
extern u16 D_8019532C[];

void func_0021B0A0(void)
{
    f32 var_f12_147;
    Panel *temp_a0_113;
    Panel *temp_a0_130;
    Panel *temp_a0_96;
    s32 squad_source_index;
    s32 actor_index;
    s32 uses_army_roster;
    u8 army_member_index;
    u8 scenario_member_index;
    u8 temp_v0_107;
    u8 temp_v0_124;
    u8 temp_v0_90;
    void *temp_a0_106;
    void *temp_a0_123;
    void *temp_a0_89;
    BattleRosterRecord *actor;
    u16 *army_special_member_hp;
    u16 *scenario_special_member_hp;

    actor_index = 0;
    army_special_member_hp = D_80190EBC;
    scenario_special_member_hp = D_8019532C;
    do {
        actor = func_0020C478(actor_index);
        if ((actor != 0) && (func_0020C0CC(actor) == 0) &&
            (actor->member_index != 0)) {
            if (func_0020C014(actor) != 0) {
                squad_source_index = *(u8 *)0x801976DC;
                uses_army_roster = squad_source_index < 0x1E;
            } else {
                squad_source_index = *(u8 *)0x801976E8;
                uses_army_roster = squad_source_index < 0x1E;
            }
            if (uses_army_roster != 0) {
                army_member_index = actor->member_index;
                if (army_member_index < 0x64U) {
                    *(u16 *)((s8 *)((army_member_index * 0x38) + 0x80190000) + 0x3BD8) =
                        actor->hp;
                } else {
                    army_special_member_hp[army_member_index] =
                        actor->hp;
                }
            } else {
                scenario_member_index = actor->member_index;
                if (scenario_member_index < 0x64U) {
                    *(u16 *)((s8 *)((scenario_member_index * 0x34) + 0x80190000) + 0x5578) =
                        actor->hp;
                } else {
                    scenario_special_member_hp[scenario_member_index] =
                        actor->hp;
                }
            }
        }
        actor_index += 1;
    } while (actor_index < 0x14);

    temp_a0_89 = D_801CE8BC;
    temp_v0_90 = *(u8 *)((s8 *)temp_a0_89 + 0x5744);
    if (temp_v0_90 != 0) {
        *(u8 *)((s8 *)temp_a0_89 + 0x5744) = temp_v0_90 - 1;
    } else {
        temp_a0_96 = *(Panel **)((s8 *)temp_a0_89 + 0x5748);
        if (temp_a0_96 != 0) {
            func_000521fc(temp_a0_96);
            *(s32 *)((s8 *)D_801CE8BC + 0x5748) = 0;
        }
    }

    temp_a0_106 = D_801CE8BC;
    temp_v0_107 = *(u8 *)((s8 *)temp_a0_106 + 0x5745);
    if (temp_v0_107 != 0) {
        *(u8 *)((s8 *)temp_a0_106 + 0x5745) = temp_v0_107 - 1;
    } else {
        temp_a0_113 = *(Panel **)((s8 *)temp_a0_106 + 0x574C);
        if (temp_a0_113 != 0) {
            func_000521fc(temp_a0_113);
            *(s32 *)((s8 *)D_801CE8BC + 0x574C) = 0;
        }
    }

    temp_a0_123 = D_801CE8BC;
    temp_v0_124 = *(u8 *)((s8 *)temp_a0_123 + 0x57D0);
    if (temp_v0_124 != 0) {
        *(u8 *)((s8 *)temp_a0_123 + 0x57D0) = temp_v0_124 - 1;
    } else {
        temp_a0_130 = *(Panel **)((s8 *)temp_a0_123 + 0x57D4);
        if (temp_a0_130 != 0) {
            func_000521fc(temp_a0_130);
            *(s32 *)((s8 *)D_801CE8BC + 0x57D4) = 0;
        }
    }

    if (D_801CE8C4 != 0) {
        if (func_0020BFE4() != 0) {
            var_f12_147 = 1.0f;
        } else {
            var_f12_147 = 1.6f;
        }
    } else {
        var_f12_147 = 0.0f;
    }
    func_0021AE6C(var_f12_147, 0);
}
