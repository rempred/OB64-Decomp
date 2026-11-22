#include "game/character_record.h"
#include "game/class_field_lookups.h"

s32 func_000449ec(CharacterRecord *arg0, s32 arg1)
{
    s32 slot;
    s32 equipment;
    u16 equipment_value;

    slot = arg1 & 0xFF;
    equipment = 0;
    switch (slot) {
    case 0:
        equipment = arg0->field_2A;
        break;
    case 1:
        equipment = arg0->field_2C;
        break;
    case 2:
        equipment = arg0->field_2E;
        break;
    case 3:
        equipment = arg0->field_30;
        break;
    }

    equipment_value = equipment & 0xFFFF;
    if (equipment_value == 0) {
        equipment = g_func_0018B494_equipment_selectors[arg1 & 0xFF](
            arg0->field_11, arg0->field_12);
    }
    return equipment & 0xFFFF;
}
