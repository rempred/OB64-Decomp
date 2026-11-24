#include "game/battle_predicates.h"
#include "game/battle_record_flag.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
void *battle_roster_lookup_actor(unsigned int actor_index);
void func_0021D230(s32 actor, s32 start_time, void *event_flags, s32 arg3);
void func_0021D25C(s32 actor, s32 start_time, void *event_flags, s32 arg3, s32 arg4);
s32 func_002224F4(void);
s32 func_0022257C(void *actor, s32 start_time, s32 *event_flags);
struct BattleUnit;
s32 func_00239AA4(struct BattleUnit *actor, unsigned int battle_flags);
void func_0022A280(void *actor, s32 start_time, u8 event_flags)
{
    s32 battle_flags;
    s32 result;
    s32 actor_index;
    BattleRosterRecord *other_actor;
    s32 duration;
    s32 end_time;
    s32 first_end_time;
    battle_flags = *(s32 *)((u8 *)actor + 0x40) & ~0x3E;
    ((BattleRosterRecord *)actor)->hp = 0;
    *(s32 *)((u8 *)actor + 0x40) = battle_flags | 1;
    result = func_002224F4();
    *(u16 *)((u8 *)*(void **)0x801CE8BC + 0x606A) = result;
    actor_index = 0;
    if ((u16)result != 0) {
        do {
            other_actor = battle_roster_lookup_actor(actor_index);
            result = battle_actor_is_absent_or_has_flag_0(other_actor);
            actor_index++;
            if (result == 0) {
                other_actor->actions_used = other_actor->action_limit;
            }
        } while (actor_index < 20);
        if (func_00239AA4(actor, *(u16 *)((u8 *)*(void **)0x801CE8BC + 0x606A)) != 0) {
            func_0021D25C(0x1D, start_time, actor, 0xFF, 0x24);
            first_end_time = start_time + func_0022257C((u8 *)((BattleRosterRecord *)actor)->primary_children[0] + 0x44, 0x24, 0);
            if (((BattleRosterRecord *)actor)->scheduled_time < first_end_time) {
                ((BattleRosterRecord *)actor)->scheduled_time = first_end_time;
            }
            return;
        }
    }
    duration = func_0022257C((u8 *)((BattleRosterRecord *)actor)->primary_children[0] + 0x44, 0x1D, 0);
    if (battle_actor_secondary_class_is_45_to_48(actor) != 0 && (event_flags & 0x10)) {
        func_0021D230(0x30, start_time, actor, 0xFF);
        func_0021D230(0x31, start_time + duration, actor, 0xFF);
    } else {
        func_0021D230(0x13, start_time, actor, 0xFF);
        func_0021D230(0x14, start_time + duration, actor, 0xFF);
    }
    end_time = start_time + duration;
    if (((BattleRosterRecord *)actor)->scheduled_time < end_time) {
        ((BattleRosterRecord *)actor)->scheduled_time = end_time;
    }
}
