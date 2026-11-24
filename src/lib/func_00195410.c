#include "game/character_record.h"

extern u8 func_00195410_helper(int value);

/* Store an equipment override in the first matching class equipment slot. */
void func_00195410(u16 equipment_id, CharacterRecord *character)
{
    u8 equipment_category;
    u8 class_id;
    CharacterClassRecord *class_record;

    equipment_category = func_00195410_helper((u16)equipment_id);
    class_id = character->primary_class_id;
    if (g_func_0019554C_class_records[class_id].related_class_id != 0) {
        class_record = &g_func_0019554C_class_records[character->secondary_class_id];
    } else {
        class_record = &g_func_0019554C_class_records[class_id];
    }

    if (class_record->default_equipment_slot_0 != 0) {
        if ((u8)func_00195410_helper(class_record->default_equipment_slot_0) == (u8)equipment_category) {
            character->equipment_slot_0 = equipment_id;
            return;
        }
    }
    if (class_record->default_equipment_slot_1 != 0) {
        if ((u8)func_00195410_helper(class_record->default_equipment_slot_1) == (u8)equipment_category) {
            character->equipment_slot_1 = equipment_id;
            return;
        }
    }
    if (class_record->default_equipment_slot_2 != 0) {
        if ((u8)func_00195410_helper(class_record->default_equipment_slot_2) == (u8)equipment_category) {
            character->equipment_slot_2 = equipment_id;
            return;
        }
    }
    if (class_record->default_equipment_slot_3 != 0) {
        if ((u8)func_00195410_helper(class_record->default_equipment_slot_3) == (u8)equipment_category) {
            character->equipment_slot_3 = equipment_id;
        }
    }
}
