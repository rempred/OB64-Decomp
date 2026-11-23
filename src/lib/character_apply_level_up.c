#include "game/character_record.h"
#include "game/class_field_lookups.h"

extern s32 rand(void);
extern u32 func_000457e4(s32);
extern s32 func_00045820(s32);
extern s32 func_00045840(s32);
extern u32 func_0004585c(s32);
extern s32 func_00045878(s32);
extern s32 func_00045898(s32);
extern s32 func_000458b8(s32);

/* Apply one level of class and equipment growth to a character below level 99. */
void character_apply_level_up(CharacterRecord *character)
{
    s16 luck_delta;
    s32 growth_class_index;
    u8 growth_class_byte;
    s32 growth_roll;
    s32 max_hp_second_roll;
    s32 max_hp_parity_temp;
    s32 strength_second_roll;
    s32 strength_parity_temp;
    s32 vitality_second_roll;
    s32 vitality_parity_temp;
    s32 intelligence_second_roll;
    s32 intelligence_parity_temp;
    s32 mentality_second_roll;
    s32 mentality_parity_temp;
    s32 agility_second_roll;
    s32 agility_parity_temp;
    s32 dexterity_second_roll;
    s32 dexterity_parity_temp;

    s32 vitality_gain;
    s32 intelligence_gain;
    s32 mentality_gain;
    s32 agility_gain;
    s32 dexterity_gain;

    u8 equipment_slot;
    s32 slot_index;
    s32 growth_item_id;
    u16 max_hp_gain;
    u16 strength_gain;
    u8 base_dexterity_gain;
    s32 equipped_item_id;
    u16 current_stat;
    u16 equipped_item_value;
    u16 value;

    u16 new_max_hp;
    u16 new_strength;
    u16 new_vitality;
    u16 new_intelligence;
    u16 new_mentality;
    u16 new_agility;
    u16 new_dexterity;
    u16 new_luck;

    s32 current_level;
    s32 growth_class_id;
    CharacterClassRecord *growth_class;

    growth_class_id = *((u8 *)character + 0x12);
    current_level = *((u8 *)character + 0x13);
    if (current_level < 99U) {
        *((u8 *)character + 0x13) = current_level + 1;
        growth_class_byte = growth_class_id;
        growth_class_index = growth_class_byte & 0xFF;
        growth_class = &g_func_0019554C_class_records[growth_class_index];

        /* Soldiers get a fixed +1. Other classes roll twice for each of the seven gains. */
        growth_roll = growth_class_index == 1
            ? 1
            : (growth_roll = rand(),
               max_hp_second_roll = rand(),
               max_hp_parity_temp = (s32)((u32)growth_roll >> 31),
               max_hp_parity_temp = (growth_roll + max_hp_parity_temp) >> 1,
               max_hp_parity_temp = max_hp_parity_temp << 1,
               growth_roll = growth_roll - max_hp_parity_temp,
               max_hp_parity_temp = (s32)((u32)max_hp_second_roll >> 31),
               max_hp_parity_temp = (max_hp_second_roll + max_hp_parity_temp) >> 1,
               max_hp_parity_temp = max_hp_parity_temp << 1,
               max_hp_second_roll = max_hp_second_roll - max_hp_parity_temp,
               growth_roll + max_hp_second_roll);
        max_hp_gain = growth_class->growth_0A + growth_roll;

        growth_roll = (u8)growth_class_byte == 1
            ? 1
            : (growth_roll = rand(),
               strength_second_roll = rand(),
               strength_parity_temp = (s32)((u32)growth_roll >> 31),
               strength_parity_temp = (growth_roll + strength_parity_temp) >> 1,
               strength_parity_temp = strength_parity_temp << 1,
               growth_roll = growth_roll - strength_parity_temp,
               strength_parity_temp = (s32)((u32)strength_second_roll >> 31),
               strength_parity_temp = (strength_second_roll + strength_parity_temp) >> 1,
               strength_parity_temp = strength_parity_temp << 1,
               strength_second_roll = strength_second_roll - strength_parity_temp,
               growth_roll + strength_second_roll);
        strength_gain = growth_class->growth_0E + growth_roll;

        growth_roll = (u8)growth_class_byte == 1
            ? 1
            : (growth_roll = rand(),
               vitality_second_roll = rand(),
               vitality_parity_temp = (s32)((u32)growth_roll >> 31),
               vitality_parity_temp = (growth_roll + vitality_parity_temp) >> 1,
               vitality_parity_temp = vitality_parity_temp << 1,
               growth_roll = growth_roll - vitality_parity_temp,
               vitality_parity_temp = (s32)((u32)vitality_second_roll >> 31),
               vitality_parity_temp = (vitality_second_roll + vitality_parity_temp) >> 1,
               vitality_parity_temp = vitality_parity_temp << 1,
               vitality_second_roll = vitality_second_roll - vitality_parity_temp,
               growth_roll + vitality_second_roll);
        vitality_gain = growth_class->growth_12 + growth_roll;

        growth_roll = (u8)growth_class_byte == 1
            ? 1
            : (growth_roll = rand(),
               intelligence_second_roll = rand(),
               intelligence_parity_temp = (s32)((u32)growth_roll >> 31),
               intelligence_parity_temp = (growth_roll + intelligence_parity_temp) >> 1,
               intelligence_parity_temp = intelligence_parity_temp << 1,
               growth_roll = growth_roll - intelligence_parity_temp,
               intelligence_parity_temp = (s32)((u32)intelligence_second_roll >> 31),
               intelligence_parity_temp = (intelligence_second_roll + intelligence_parity_temp) >> 1,
               intelligence_parity_temp = intelligence_parity_temp << 1,
               intelligence_second_roll = intelligence_second_roll - intelligence_parity_temp,
               growth_roll + intelligence_second_roll);
        intelligence_gain = growth_class->growth_16 + growth_roll;

        growth_roll = (u8)growth_class_byte == 1
            ? 1
            : (growth_roll = rand(),
               mentality_second_roll = rand(),
               mentality_parity_temp = (s32)((u32)growth_roll >> 31),
               mentality_parity_temp = (growth_roll + mentality_parity_temp) >> 1,
               mentality_parity_temp = mentality_parity_temp << 1,
               growth_roll = growth_roll - mentality_parity_temp,
               mentality_parity_temp = (s32)((u32)mentality_second_roll >> 31),
               mentality_parity_temp = (mentality_second_roll + mentality_parity_temp) >> 1,
               mentality_parity_temp = mentality_parity_temp << 1,
               mentality_second_roll = mentality_second_roll - mentality_parity_temp,
               growth_roll + mentality_second_roll);
        mentality_gain = growth_class->growth_1A + growth_roll;

        growth_roll = (u8)growth_class_byte == 1
            ? 1
            : (growth_roll = rand(),
               agility_second_roll = rand(),
               agility_parity_temp = (s32)((u32)growth_roll >> 31),
               agility_parity_temp = (growth_roll + agility_parity_temp) >> 1,
               agility_parity_temp = agility_parity_temp << 1,
               growth_roll = growth_roll - agility_parity_temp,
               agility_parity_temp = (s32)((u32)agility_second_roll >> 31),
               agility_parity_temp = (agility_second_roll + agility_parity_temp) >> 1,
               agility_parity_temp = agility_parity_temp << 1,
               agility_second_roll = agility_second_roll - agility_parity_temp,
               growth_roll + agility_second_roll);
        agility_gain = growth_class->growth_1E + growth_roll;

        growth_roll = (u8)growth_class_byte == 1
            ? 1
            : (growth_roll = rand(),
               dexterity_second_roll = rand(),
               dexterity_parity_temp = (s32)((u32)growth_roll >> 31),
               dexterity_parity_temp = (growth_roll + dexterity_parity_temp) >> 1,
               dexterity_parity_temp = dexterity_parity_temp << 1,
               growth_roll = growth_roll - dexterity_parity_temp,
               dexterity_parity_temp = (s32)((u32)dexterity_second_roll >> 31),
               dexterity_parity_temp = (dexterity_second_roll + dexterity_parity_temp) >> 1,
               dexterity_parity_temp = dexterity_parity_temp << 1,
               dexterity_second_roll = dexterity_second_roll - dexterity_parity_temp,
               growth_roll + dexterity_second_roll);
        base_dexterity_gain = growth_class->growth_22;
        luck_delta = 0;
        slot_index = 0;
        dexterity_gain = base_dexterity_gain + growth_roll;

        /* An empty equipment slot uses its class default when one is available. */
        do {
            s32 slot;

            equipment_slot = slot_index;
            slot = equipment_slot & 0xFF;
            equipped_item_id = 0;
            switch (slot) {
            case 0:
                equipped_item_id = character->field_2A;
                break;
            case 1:
                equipped_item_id = character->field_2C;
                break;
            case 2:
                equipped_item_id = character->field_2E;
                break;
            case 3:
                equipped_item_id = character->field_30;
                break;
            }

            equipped_item_value = equipped_item_id & 0xFFFF;
            if (equipped_item_value == 0) {
                equipped_item_id = g_func_0018B494_equipment_selectors[equipment_slot & 0xFF](
                    character->field_11, character->field_12);
            }
            growth_item_id = equipped_item_id & 0xFFFF;
            if (growth_item_id == 0) {
                goto equipment_advance;
            }
            max_hp_gain += (s8)func_000457e4(growth_item_id);
            strength_gain += (s8)func_000457e4(growth_item_id);
            intelligence_gain += (s8)func_00045820(growth_item_id);
            agility_gain += (s8)func_00045840(growth_item_id);
            dexterity_gain += (s8)func_0004585c(growth_item_id);
            vitality_gain += (s8)func_00045878(growth_item_id);
            mentality_gain += (s8)func_00045898(growth_item_id);
            luck_delta += (s8)func_000458b8(growth_item_id);

equipment_advance:
            slot_index += 1;
        } while (slot_index < 4);

        /* Apply the gains after equipment bonuses, capping each stat at 999. */
        current_stat = character->field_16;
        new_max_hp = (current_stat + max_hp_gain) < 1000;
        if (new_max_hp != 0) {
            new_max_hp = current_stat + max_hp_gain;
        } else {
            new_max_hp = 999;
        }
        character->field_16 = new_max_hp;

        current_stat = character->field_1C;
        new_strength = (current_stat + strength_gain) < 1000;
        if (new_strength != 0) {
            new_strength = current_stat + strength_gain;
        } else {
            new_strength = 999;
        }
        character->field_1C = new_strength;

        current_stat = character->field_1E;
        new_vitality = (current_stat + (vitality_gain & 0xFFFF)) < 1000;
        if (new_vitality != 0) {
            new_vitality = current_stat + vitality_gain;
        } else {
            new_vitality = 999;
        }
        character->field_1E = new_vitality;

        current_stat = character->field_20;
        new_intelligence = (current_stat + (intelligence_gain & 0xFFFF)) < 1000;
        if (new_intelligence != 0) {
            new_intelligence = current_stat + intelligence_gain;
        } else {
            new_intelligence = 999;
        }
        character->field_20 = new_intelligence;

        current_stat = character->field_22;
        new_mentality = (current_stat + (mentality_gain & 0xFFFF)) < 1000;
        if (new_mentality != 0) {
            new_mentality = current_stat + mentality_gain;
        } else {
            new_mentality = 999;
        }
        character->field_22 = new_mentality;

        current_stat = character->field_24;
        new_agility = (current_stat + (agility_gain & 0xFFFF)) < 1000;
        if (new_agility != 0) {
            new_agility = current_stat + agility_gain;
        } else {
            new_agility = 999;
        }
        character->field_24 = new_agility;

        current_stat = character->field_26;
        new_dexterity = (current_stat + (dexterity_gain & 0xFFFF)) < 1000;
        if (new_dexterity != 0) {
            new_dexterity = current_stat + dexterity_gain;
        } else {
            new_dexterity = 999;
        }
        character->field_26 = new_dexterity;

        /* Only equipment contributes to the luck gain. Clamp the result to 0 through 100. */
        if ((character->field_28 + luck_delta) < 0) {
            character->field_28 = 0;
            return;
        }
        new_luck = (character->field_28 + luck_delta) < 101;
        if (new_luck != 0) {
            new_luck = character->field_28 + luck_delta;
        } else {
            new_luck = 100;
        }
        character->field_28 = new_luck;
    }
}
