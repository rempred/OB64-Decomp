#include "game/combat_types.h"

#include "game/battle_roster_record.h"

extern unsigned char D_80195560[];
extern void func_80093380(void *, u32);

static __inline__ int kind1(BattleRosterRecord *actor)
{
    if (!actor) return 0;
    return actor->secondary_class_id.word == 1;
}

/* Initialize a battle actor from a scenario roster member. */
void func_0020C908(BattleRosterRecord *actor, int member_index)
{
    /* The resident table and its 0x34-byte stride keep these halfword fields aligned. */
    unsigned char *scenario_character_bytes = D_80195560 + (u32)member_index * 0x34u;
    u32 secondary_class_id;
    func_80093380(actor, 0xF8);
    actor->primary_class_id.word = scenario_character_bytes[0x11];
    secondary_class_id = scenario_character_bytes[0x12];
    actor->member_index = member_index;
    actor->secondary_class_id.word = secondary_class_id;
    actor->level = scenario_character_bytes[0x13];
    actor->element = scenario_character_bytes[0x1A];
    actor->max_hp = *(u16 *)(scenario_character_bytes + 0x16);
    actor->hp = *(u16 *)(scenario_character_bytes + 0x18);
    actor->strength = *(u16 *)(scenario_character_bytes + 0x1C);
    actor->vitality = *(u16 *)(scenario_character_bytes + 0x1E);
    actor->intelligence = *(u16 *)(scenario_character_bytes + 0x20);
    actor->mentality = *(u16 *)(scenario_character_bytes + 0x22);
    actor->agility = *(u16 *)(scenario_character_bytes + 0x24);
    actor->dexterity = *(u16 *)(scenario_character_bytes + 0x26);
    actor->luck = scenario_character_bytes[0x28];
    /* Keep a reference copy of the starting alignment. */
    actor->alignment = actor->reference_alignment = scenario_character_bytes[0x1B];
    actor->equipment_slot_0 = *(u16 *)(scenario_character_bytes + 0x2A);
    actor->equipment_slot_1 = *(u16 *)(scenario_character_bytes + 0x2C);
    actor->equipment_slot_2 = *(u16 *)(scenario_character_bytes + 0x2E);
    actor->equipment_slot_3 = *(u16 *)(scenario_character_bytes + 0x30);
    actor->fatigue = scenario_character_bytes[0x32];
    if (kind1(actor)) actor->fatigue = 0;
    if (scenario_character_bytes[0x33] & 2) actor->battle_flags |= 0x200;
    if (scenario_character_bytes[0x33] & 4) actor->battle_flags |= 2;
    actor->battle_flags |= 0x500;
}
