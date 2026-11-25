#ifndef OB64_GAME_CHARACTER_EQUIPMENT_PREVIEW_H
#define OB64_GAME_CHARACTER_EQUIPMENT_PREVIEW_H

#include "game/character_record.h"
#include "game/character_equipment.h"

typedef struct InventoryEntry {
    u16 equipment_id;
    u8 equipped_count;
    u8 total_count;
} InventoryEntry;

enum {
    CHARACTER_TABLE_CAPACITY = 100,
    PREVIEW_FLAGS_OFFSET = 0xA4,
    PREVIEW_SELECTION_INDEX_OFFSET = 0x1BDA,
    PREVIEW_INVENTORY_INDICES_OFFSET = 0x1BEE,
    PREVIEW_EQUIPMENT_SLOT_OFFSET = 0x1E20,
    PREVIEW_FLAG_INVENTORY = 0x20,
    PREVIEW_FLAG_CLASS_EQUIPMENT = 0x80
};

extern u8 *D_80196AF8;
extern InventoryEntry D_80196B00[];

static inline u16 get_slot_equipment(s32 selected_mode, s32 army_offset, s32 scenario_offset,
                                     u32 army_base, u32 equipment_selector_base, s32 slot_word)
{
    const CharacterRecord *character;
    u32 equipment_id;
    /* Reuse the scenario address carrier for the selector entry address. */
    u32 lookup_address;
    u32 callback_slot;
    u8 primary_class_id;
    u8 secondary_class_id;

    if (selected_mode == 0) {
        character = (const CharacterRecord *)(army_offset + army_base);
    } else {
        lookup_address = (u32)D_80195560;
        character = (const CharacterRecord *)(scenario_offset + lookup_address);
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
        lookup_address = callback_slot * sizeof(EquipmentSelector) + equipment_selector_base;
        equipment_id = (*(EquipmentSelector *)lookup_address)(primary_class_id, secondary_class_id);
    }

    return (u16)equipment_id;
}

static inline u32 get_default_equipment(s32 selected_mode, s32 army_offset, s32 scenario_offset,
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
    return (*(EquipmentSelector *)(equipment_selector_base
            + callback_slot * sizeof(EquipmentSelector)))(
            character->primary_class_id, character->secondary_class_id);
}

#endif
