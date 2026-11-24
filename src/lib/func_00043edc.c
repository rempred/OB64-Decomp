#include "game/class_field_lookups.h"

#include "game/class_entry.h"

u32 func_00043edc(s32 primary_class_id, s32 secondary_class_id)
{
    ClassEntry *classes;
    int primary_class;
    int alternate_class;

    classes = (ClassEntry *)0x80187C40;
    primary_class = primary_class_id & 0xFF;
    alternate_class = secondary_class_id & 0xFF;
    if (classes[primary_class].related_class_19 == alternate_class) {
        return classes[primary_class].default_equipment_slot_1;
    }

    return classes[alternate_class].default_equipment_slot_1;
}
