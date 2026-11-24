#include "game/battle_record_flag.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

#include "game/battle_roster_record.h"

typedef BattleRosterRecord RosterRow;

typedef struct RosterTable {
    u8 unknown00[0x1C4];
    RosterRow rows[20];
} RosterTable;

extern RosterTable *D_801CE8BC;
extern u8 D_801971F0[];
extern u16 D_8019532C[];
extern u8 D_80195480[];
extern u8 func_00043dc4(s32, s32);
extern void func_001F0F6C(void *record);
extern void func_001F102C(void *record);
extern void *battle_roster_lookup_actor(unsigned int index);
extern u16 func_0020C448(void *);
extern s32 func_002015C8(s32, s32, s32, s32);
extern void func_00207658(s32 *, s32 *, s32 *, s32 *, s32 *, u32);
extern void func_001F114C(void *);

/* The retail frame holds six parallel arrays of 18 words. They collect
 * distinct row descriptors, sort by the returned key, and submit equal-key
 * runs. Names retain offsets where the field meaning is not established. */
void func_002ACA3C(s32 squad_source_index)
{
    s32 classes[18];
    u32 keys[18];
    s32 tags[18];
    s32 flagsA[18];
    s32 flagsB[18];
    s32 variants[18];
    s32 member_slot;
    s32 free_actor_index;
    s32 final_actor_index;
    s32 child_index;
    s32 special = 0;
    u8 *squad_source = D_801971F0 + squad_source_index * 25;
    /* Separate pointers keep the three phases' register lifetimes distinct. */
    RosterRow *actor;
    RosterRow *candidate;
    RosterRow *current;
    u32 count;
    u32 actor_or_resource_index;
    u32 index;
    u32 shift;
    u32 key;
    s32 tag;
    s32 resource_flag_a;
    s32 resource_flag_b;
    u32 run;

    for (member_slot = 0; member_slot < 5; member_slot++) {
        if (squad_source[member_slot + 2] == 0) continue;
        for (free_actor_index = 0; free_actor_index < 20; free_actor_index++) {
            if (D_801CE8BC->rows[free_actor_index].primary_class_id.word == 0) break;
        }
        actor = &D_801CE8BC->rows[free_actor_index];
        if (battle_actor_has_flag_9(actor) &&
            func_00043dc4(actor->primary_class_id.bytes.low, actor->secondary_class_id.bytes.low) == 2) {
            special = 1;
        }
        if (squad_source[member_slot + 2] < 100U) {
            battle_roster_init_actor_from_scenario_member(actor, squad_source[member_slot + 2]);
            actor->formation_column = (u8)(squad_source[member_slot + 7] % 3U);
            actor->formation_row = (u8)(squad_source[member_slot + 7] / 3U);
            func_0020CBDC(actor, 0);
        } else {
            battle_roster_init_actor_from_scenario_member(actor, 0);
            actor->formation_column = (u8)(squad_source[member_slot + 7] % 3U);
            actor->formation_row = (u8)(squad_source[member_slot + 7] / 3U);
            actor->member_index = squad_source[member_slot + 2];
            actor->hp = D_8019532C[actor->member_index];
            if (D_80195480[actor->member_index] & 4) actor->battle_flags |= 2;
            func_0020CBDC(actor, special);
        }
        for (child_index = 0; child_index < 3; child_index++) {
            if (actor->primary_children[child_index]) func_001F0F6C(actor->primary_children[child_index]);
            if (actor->secondary_children[child_index]) func_001F102C(actor->secondary_children[child_index]);
        }
    }

    count = 0;
    for (actor_or_resource_index = 0; actor_or_resource_index < 20; actor_or_resource_index++) {
        candidate = battle_roster_lookup_actor(actor_or_resource_index);
        if (!candidate || battle_actor_is_side_zero(candidate)) continue;
        tag = func_0020C448(candidate);
        resource_flag_b = battle_actor_is_side_one(candidate);
        resource_flag_a = resource_flag_b;
        for (index = 0; index < count; index++) {
            if (candidate->primary_class_id.word == classes[index] && tag == tags[index] &&
                resource_flag_a == flagsA[index] && resource_flag_b == flagsB[index]) break;
        }
        if (index < count) continue;
        index = 0;
        key = func_002015C8(candidate->primary_class_id.word, candidate->secondary_class_id.word, resource_flag_a, resource_flag_b);
        for (; index < count; index++) {
            if (key < keys[index]) break;
        }
        for (shift = count; shift > index; shift--) {
            classes[shift] = classes[shift - 1];
            variants[shift] = variants[shift - 1];
            keys[shift] = keys[shift - 1];
            tags[shift] = tags[shift - 1];
            flagsA[shift] = flagsA[shift - 1];
            flagsB[shift] = flagsB[shift - 1];
        }
        classes[shift] = candidate->primary_class_id.word;
        variants[shift] = candidate->secondary_class_id.word;
        keys[shift] = key;
        tags[shift] = tag;
        flagsA[shift] = resource_flag_a;
        flagsB[shift] = resource_flag_b;
        count++;
    }

    if (count) {
        for (actor_or_resource_index = 0; actor_or_resource_index < count; actor_or_resource_index += run) {
            for (run = 1; run < count; run++) {
                if (keys[actor_or_resource_index + run] != keys[actor_or_resource_index]) break;
            }
            func_00207658(&classes[actor_or_resource_index], &variants[actor_or_resource_index],
                &flagsB[actor_or_resource_index], &flagsA[actor_or_resource_index], &tags[actor_or_resource_index], run);
        }
        for (final_actor_index = 0; final_actor_index < 20; final_actor_index++) {
            current = battle_roster_lookup_actor(final_actor_index);
            if (current && !battle_actor_is_side_zero(current)) func_001F114C(current);
        }
    }
}
