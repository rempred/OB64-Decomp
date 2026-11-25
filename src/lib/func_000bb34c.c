#include "game/character_record.h"
#include "game/character_equipment.h"

/* Get class equipment for the selected character and callback slot. */
u16 func_000bb34c(s32 table_mode, u8 character_index, u8 slot)
{
    const CharacterRecord *character;
    u32 equipment_id;

    if ((table_mode & 0xFF) == 0) {
        character = &D_80193BC0[character_index].record;
    } else {
        character = &D_80195560[character_index];
    }

    if (slot == 0) {
        equipment_id = 0;
    } else {
        equipment_id = D_801EF288[slot - 1](
            character->primary_class_id, character->secondary_class_id);
    }
    return (u16)equipment_id;
}
