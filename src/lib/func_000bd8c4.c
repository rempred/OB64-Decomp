#include "game/character_equipment_preview.h"

/* Sum the alternate equipment stat adjustment for every preview slot. */
s16 func_000bd8c4(s32 table_mode, s32 character_index, s32 stat_index)
{
    s32 total = 0;
    s32 updated_total;
    s32 slot;
    u8 original_index = character_index;
    CharacterRecord *checked_character;
    u8 primary_value;
    volatile u8 class_ids[2];
    volatile u8 *primary_class_out;
    s32 selected_mode;
    s32 adjustment_index;
    s32 army_offset;
    s32 scenario_offset;
    u32 army_base;
    u32 equipment_selector_base;
    const AlternateEquipmentStatAdjustment *adjustment_base;
    const AlternateEquipmentStatAdjustment *adjustment_table;

    /* Keep the checked index and then its record address in the same temporary for KMC. */
    character_index &= -(original_index < CHARACTER_TABLE_CAPACITY);
    /* Retail writes both class bytes to the stack, even though this sum does not read them. */
    primary_class_out = &class_ids[0];
    if ((u8)table_mode == 0) {
        character_index = (s32)&D_80193BC0[(u8)character_index].record;
    } else {
        character_index = (s32)&D_80195560[(u8)character_index];
    }

    checked_character = (CharacterRecord *)character_index;
    slot = 1;
    selected_mode = table_mode & 0xFF;
    army_offset = original_index * sizeof(CharacterRecord56);
    army_base = (u32)D_80193BC0;
    primary_value = checked_character->primary_class_id;
    scenario_offset = original_index * sizeof(CharacterRecord);
    equipment_selector_base = (u32)D_801EF288 - sizeof(EquipmentSelector);
    adjustment_index = stat_index & 0xFF;
    adjustment_base = table_000dbcd0.alternate;
    adjustment_table = &adjustment_base[adjustment_index];
    *primary_class_out = primary_value;
    class_ids[1] = checked_character->secondary_class_id;

    do {
        u32 equipment_id;
        s32 slot_word = slot;
        u8 *preview_state;
        u16 preview_flags;
        u32 adjustment_argument;
        u32 class_equipment;
        s16 stored_equipment;

        equipment_id = get_slot_equipment(selected_mode, army_offset, scenario_offset,
            army_base, equipment_selector_base, slot_word);

        /* Keep the stored halfword separate from the word passed through preview selection. */
        stored_equipment = (s16)equipment_id;
        preview_state = D_80196AF8;
        preview_flags = *(u16 *)(preview_state + PREVIEW_FLAGS_OFFSET);
        adjustment_argument = (u16)stored_equipment;
        if (preview_flags & PREVIEW_FLAG_INVENTORY) {
            if (stored_equipment != 0 && slot == *(u16 *)(preview_state + PREVIEW_EQUIPMENT_SLOT_OFFSET)) {
                s16 selection_index = *(s16 *)(preview_state + PREVIEW_SELECTION_INDEX_OFFSET);
                u16 inventory_index = ((u16 *)(preview_state + PREVIEW_INVENTORY_INDICES_OFFSET))[selection_index];

                adjustment_argument = D_80196B00[inventory_index].equipment_id;
            }
        } else {
            if (preview_flags & PREVIEW_FLAG_CLASS_EQUIPMENT) {
                /* Preserve the full callback result until the final halfword conversion. */
                class_equipment = get_default_equipment(selected_mode, army_offset,
                    scenario_offset, army_base, equipment_selector_base, slot);
                adjustment_argument = class_equipment;
            }
        }

        /* Keep the new sum available to the return path while the latch updates total. */
        updated_total = total
            + (*adjustment_table)((u16)adjustment_argument);
        slot++;
        total = updated_total;
    } while (slot < 5);

    return (s16)updated_total;
}
