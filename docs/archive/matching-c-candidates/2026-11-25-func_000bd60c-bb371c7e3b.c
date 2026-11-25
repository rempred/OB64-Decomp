#include "game/character_record.h"
#include "game/class_field_lookups.h"

typedef s8 (*EquipmentStatAdjustment)(u16 equipment_id);

typedef struct InventoryEntry {
    u16 equipment_id;
    u8 equipped_count;
    u8 total_count;
} InventoryEntry;

enum { CHARACTER_TABLE_CAPACITY = 100 };

extern EquipmentSelector D_801EF288[];
extern EquipmentStatAdjustment table_000dbcd0[];
extern u8 *volatile D_80196AF8;
extern InventoryEntry D_80196B00[];

static inline u16 get_slot_equipment(s32 selected_mode, s32 army_offset, s32 scenario_offset,
                                           u32 army_base, u32 equipment_selector_base, s32 slot_word)
{
    const CharacterRecord *character;
    u32 equipment_id;
    u32 scenario_base;
    u32 callback_slot;
    u8 primary_class_id;
    u8 secondary_class_id;

    if (selected_mode == 0) {
        character = (const CharacterRecord *)(army_offset + army_base);
    } else {
        scenario_base = (u32)D_80195560;
        character = (const CharacterRecord *)(scenario_offset + scenario_base);
    }

    primary_class_id = character->primary_class_id;
    secondary_class_id = character->secondary_class_id;
    switch ((u8)slot_word) {
    case 1:
        equipment_id = character->equipment_slot_0;
        break;
    case 2:
        equipment_id = character->equipment_slot_1;
        break;
    case 3:
        equipment_id = character->equipment_slot_2;
        break;
    default:
        equipment_id = character->equipment_slot_3;
        break;
    }

    callback_slot = (u8)slot_word;
    if ((u16)equipment_id == 0 && ((callback_slot != 0) & (callback_slot < 5))) {
        scenario_base = callback_slot * sizeof(EquipmentSelector) + equipment_selector_base;
        equipment_id = (*(EquipmentSelector *)scenario_base)(primary_class_id, secondary_class_id);
    }

    return (u16)equipment_id;
}

static inline u16 get_default_equipment(s32 selected_mode, s32 army_offset, s32 scenario_offset,
                                         u32 army_base, u32 equipment_selector_base, s32 slot)
{
    const CharacterRecord *character;
    u32 lookup_word;
    u8 callback_slot = slot;

    if (selected_mode == 0) {
        character = (const CharacterRecord *)(army_offset + army_base);
    } else {
        lookup_word = (u32)D_80195560;
        character = (const CharacterRecord *)(scenario_offset + lookup_word);
    }

    if (callback_slot == 0) {
        return 0;
    }
    return (u16)(*(EquipmentSelector *)(equipment_selector_base
            + callback_slot * sizeof(EquipmentSelector)))(
            character->primary_class_id, character->secondary_class_id);
}

/* Sum equipment stat adjustments for the current equipment preview. */
s16 func_000bd60c(s32 table_mode, s32 character_index, s32 stat_index)
{
    s32 total = 0;
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
    const EquipmentStatAdjustment *adjustment_base;
    const EquipmentStatAdjustment *adjustment_table;

    character_index &= -(original_index < CHARACTER_TABLE_CAPACITY);
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
    adjustment_base = table_000dbcd0;
    adjustment_table = &adjustment_base[adjustment_index];
    *primary_class_out = primary_value;
    class_ids[1] = checked_character->secondary_class_id;

    do {
        u32 equipment_id;
        s32 slot_word = slot;
        u8 *preview_state;
        u16 preview_flags;
        u32 adjustment_argument;
        s16 stored_equipment;

        equipment_id = get_slot_equipment(selected_mode, army_offset, scenario_offset,
             army_base, equipment_selector_base, slot_word);

        stored_equipment = (s16)equipment_id;
        preview_state = D_80196AF8;
        preview_flags = *(u16 *)(preview_state + 0xA4);
        adjustment_argument = (u16)stored_equipment;
        if (preview_flags & 0x20) {
            if (stored_equipment == 0) {
                goto empty_preview_slot;
            }
            if (slot == *(u16 *)(preview_state + 0x1E20)) {
                s16 selection_index = *(s16 *)(preview_state + 0x1BDA);
                u16 inventory_index = ((u16 *)(preview_state + 0x1BEE))[selection_index];

                adjustment_argument = D_80196B00[inventory_index].equipment_id;
            }
        } else {
            if (preview_flags & 0x80) {
                adjustment_argument = get_default_equipment(selected_mode, army_offset,
                    scenario_offset, army_base, equipment_selector_base, slot);
            }
        }

        slot++;
        if ((u16)adjustment_argument != 0) {
            total += (*adjustment_table)((u16)adjustment_argument);
        }
        goto check_next_slot;

    empty_preview_slot:
        slot++;
    check_next_slot:
        ;
    } while (slot < 5);

    return (s16)total;
}
