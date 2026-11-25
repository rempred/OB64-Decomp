#include "game/character_record.h"
#include "game/character_equipment.h"

/* Read a character's equipment slot, falling back to its class equipment. */
u16 func_000bb47c(s32 table_mode, s32 character_index, s32 slot)
{
    const CharacterRecord *character;
    u8 primary_class_id;
    u8 secondary_class_id;
    u32 equipment_id;
    u32 callback_slot;

    if ((table_mode & 0xFF) == 0) {
        character = &D_80193BC0[(u8)character_index].record;
    } else {
        character = &D_80195560[(u8)character_index];
    }

    primary_class_id = character->primary_class_id;
    secondary_class_id = character->secondary_class_id;

    switch ((u8)slot) {
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

    callback_slot = (u8)slot;
    if ((u16)equipment_id == 0 && ((callback_slot != 0) & (callback_slot < 5))) {
        equipment_id = D_801EF288[callback_slot - 1](
            primary_class_id, secondary_class_id);
    }
    return (u16)equipment_id;
}
