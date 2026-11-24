#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;

/* The two class bytes become separate word fields in the battle row. */
typedef struct CharacterInput {
    u8 pad_00[0x11];
    u8 primary_class_id;
    u8 secondary_class_id;
    u8 level;
    u8 pad_14[2];
    u16 max_hp;
    u16 hp;
    u8 element;
    u8 alignment;
    u16 strength;
    u16 vitality;
    u16 intelligence;
    u16 mentality;
    u16 agility;
    u16 dexterity;
    u8 luck;
    u8 pad_29;
    u16 equipment[4];
    u8 fatigue;
    u8 status_flags;
    u8 pad_34;
    u8 experience;
    u8 pad_36[2];
} CharacterInput;

extern CharacterInput D_80193BC0[];
extern void func_00023780(void *destination, u32 size);

/* Initialize a battle actor from an Army roster member, including experience. */
void battle_roster_init_actor_from_army_member(BattleRosterRecord *actor, s32 member_index)
{
    CharacterInput *army_character;
    s32 secondary_class_id;
    s32 has_secondary_class_one;
    u8 alignment;

    army_character = &D_80193BC0[member_index];
    func_00023780(actor, sizeof(*actor));
    actor->primary_class_id.word = army_character->primary_class_id;
    secondary_class_id = army_character->secondary_class_id;
    actor->member_index = member_index;
    actor->secondary_class_id.word = secondary_class_id;
    actor->level = army_character->level;
    actor->element = army_character->element;
    actor->max_hp = army_character->max_hp;
    actor->hp = army_character->hp;
    actor->strength = army_character->strength;
    actor->vitality = army_character->vitality;
    actor->intelligence = army_character->intelligence;
    actor->mentality = army_character->mentality;
    actor->agility = army_character->agility;
    actor->dexterity = army_character->dexterity;
    actor->luck = army_character->luck;
    alignment = army_character->alignment;
    actor->reference_alignment = alignment;
    actor->alignment = alignment;
    actor->equipment_slot_0 = army_character->equipment[0];
    actor->equipment_slot_1 = army_character->equipment[1];
    actor->equipment_slot_2 = army_character->equipment[2];
    actor->equipment_slot_3 = army_character->equipment[3];
    actor->fatigue = army_character->fatigue;

    if (actor == 0) {
        has_secondary_class_one = 0;
    } else {
        has_secondary_class_one = actor->secondary_class_id.word == 1;
    }
    if (has_secondary_class_one) {
        actor->fatigue = 0;
    }
    if (army_character->status_flags & 2) {
        actor->battle_flags |= 0x200;
    }
    if (army_character->status_flags & 4) {
        actor->battle_flags |= 2;
    }
    actor->experience = army_character->experience;
}
