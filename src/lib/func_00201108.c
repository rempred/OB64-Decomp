#include "game/battle_roster_types.h"

typedef unsigned char u8;
typedef signed char s8;
typedef signed int s32;
typedef unsigned int u32;

typedef struct {
    u8 bytes[0x19];
} SourceRecord;

typedef struct {
    u8 unk_00[2];
    u8 id;
    u8 unk_03[4];
    s8 value;
} WorkingRecord;

extern u8 *D_801CE8C0;
extern u8 D_801976DC;
extern u8 D_801976E8;
extern SourceRecord g_func_001957D0_source_records[];

void *battle_roster_lookup_actor(unsigned int index);
s32 battle_actor_is_side_zero(void *actor);
s32 battle_actor_is_side_one(void *actor);
s32 battle_actor_is_absent_or_has_flag_0(void *actor);

void func_00201108(void)
{
    BattleRosterRecord *actor;
    s32 first_limit;
    void *entry;
    volatile WorkingRecord *record;
    WorkingRecord *first_record_end;
    WorkingRecord *second_record_end;
    s32 actor_index;

    *(SourceRecord *)(D_801CE8C0 + 0x82F) =
        g_func_001957D0_source_records[D_801976DC];
    *(SourceRecord *)(D_801CE8C0 + 0x848) =
        g_func_001957D0_source_records[D_801976E8];

    record = D_801CE8C0 + 0x82F;
    first_record_end = D_801CE8C0 + 0x834;
    first_limit = 8;
    do {
        actor_index = 0;
        if (record->id != 0) {
            entry = (void *)record;
            do {
                actor = battle_roster_lookup_actor(actor_index);
                if (actor != 0 && battle_actor_is_side_zero(actor) != 0 &&
                    actor->member_index == *(u8 *)((s8 *)entry + 2)) {
                    if (battle_actor_is_absent_or_has_flag_0(actor) != 0) {
                        *(u8 *)((s8 *)entry + 2) = 0;
                    } else {
                        *(s8 *)((s8 *)entry + 7) =
                            (s8)((u32)((first_limit - actor->formation_row) * 3) -
                                 ((u32)actor->formation_column - 2));
                        break;
                    }
                }
                actor_index++;
            } while (actor_index < 20);
            if (actor_index >= 20) {
                record->id = 0;
            }
        }
        record = (volatile WorkingRecord *)((s8 *)record + 1);
    } while ((u32)record < (u32)first_record_end);

    record = D_801CE8C0 + 0x848;
    second_record_end = D_801CE8C0 + 0x84D;
    do {
        actor_index = 0;
        if (record->id != 0) {
            entry = (void *)record;
            do {
                actor = battle_roster_lookup_actor(actor_index);
                if (actor != 0 && battle_actor_is_side_one(actor) != 0 &&
                    actor->member_index == *(u8 *)((s8 *)entry + 2)) {
                    if (battle_actor_is_absent_or_has_flag_0(actor) != 0) {
                        *(u8 *)((s8 *)entry + 2) = 0;
                    } else {
                        *(s8 *)((s8 *)entry + 7) =
                            (s8)(actor->formation_row * 3 +
                                 actor->formation_column);
                        break;
                    }
                }
                actor_index++;
            } while (actor_index < 20);
            if (actor_index >= 20) {
                record->id = 0;
            }
        }
        record = (volatile WorkingRecord *)((s8 *)record + 1);
    } while ((u32)record < (u32)second_record_end);
}
