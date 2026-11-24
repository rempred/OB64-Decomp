#include "game/character_record.h"
#include "game/class_field_lookups.h"

/* Return the selected slot's equipment, falling back to the class default. */
s32 func_000449ec(CharacterRecord *character, s32 slot_word)
{
    s32 slot;
    s32 equipment_id;
    u16 equipped_id;

    slot = slot_word & 0xFF;
    equipment_id = 0;
    switch (slot) {
    case 0:
        equipment_id = character->equipment_slot_0;
        break;
    case 1:
        equipment_id = character->equipment_slot_1;
        break;
    case 2:
        equipment_id = character->equipment_slot_2;
        break;
    case 3:
        equipment_id = character->equipment_slot_3;
        break;
    }

    equipped_id = equipment_id & 0xFFFF;
    if (equipped_id == 0) {
        equipment_id = g_func_0018B494_equipment_selectors[slot_word & 0xFF](
            character->primary_class_id, character->secondary_class_id);
    }
    return equipment_id & 0xFFFF;
}
