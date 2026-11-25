#include "game/character_record.h"
#include "game/character_equipment.h"

/* Sum the selected stat adjustment from a character's four class equipment slots. */
s16 func_000bd4f4(s32 table_mode, s32 character_index, s32 stat_index)
{
    s32 total = 0;
    s32 slot = 1;
    s32 army_offset;
    s32 scenario_offset;
    EquipmentStatAdjustment stat_adjustment;
    const EquipmentStatAdjustment *adjustment_base;
    const EquipmentStatAdjustment *adjustment_table;
    s32 selected_mode;
    u32 equipment_selector_base;

    selected_mode = table_mode & 0xFF;
    character_index &= 0xFF;
    army_offset = character_index * sizeof(CharacterRecord56);
    scenario_offset = character_index * sizeof(CharacterRecord);
    equipment_selector_base = (u32)D_801EF288 - sizeof(EquipmentSelector);
    stat_index &= 0xFF;
    adjustment_base = table_000dbcd0.stat;
    adjustment_table = &adjustment_base[stat_index];

    do {
        const CharacterRecord *character;
        /* Reuse the table-base temporary for the equipment lookup result. */
        u32 lookup_word;
        u8 callback_slot = slot;

        if (selected_mode == 0) {
            lookup_word = (u32)D_80193BC0;
            character = (const CharacterRecord *)(army_offset + lookup_word);
        } else {
            lookup_word = (u32)D_80195560;
            character = (const CharacterRecord *)(scenario_offset + lookup_word);
        }

        if (callback_slot == 0) {
            lookup_word = 0;
        } else {
            lookup_word = (*(EquipmentSelector *)(equipment_selector_base
                + callback_slot * sizeof(EquipmentSelector)))(
                character->primary_class_id, character->secondary_class_id);
        }
        slot++;
        if ((u16)lookup_word != 0) {
            stat_adjustment = *adjustment_table;
            total += stat_adjustment((u16)lookup_word);
        }
    } while (slot < 5);

    return (s16)total;
}
