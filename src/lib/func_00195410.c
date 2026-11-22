#include "game/character_record.h"

extern u8 func_00195410_helper(int value);

void func_00195410(u16 value, CharacterRecord *record)
{
    u8 initial_result;
    u8 class_id;
    CharacterClassRecord *class_record;

    initial_result = func_00195410_helper((u16)value);
    class_id = record->field_11;
    if (g_func_0019554C_class_records[class_id].field_45 != 0) {
        class_record = &g_func_0019554C_class_records[record->field_12];
    } else {
        class_record = &g_func_0019554C_class_records[class_id];
    }

    if (class_record->field_2E != 0) {
        if ((u8)func_00195410_helper(class_record->field_2E) == (u8)initial_result) {
            record->field_2A = value;
            return;
        }
    }
    if (class_record->field_30 != 0) {
        if ((u8)func_00195410_helper(class_record->field_30) == (u8)initial_result) {
            record->field_2C = value;
            return;
        }
    }
    if (class_record->field_32 != 0) {
        if ((u8)func_00195410_helper(class_record->field_32) == (u8)initial_result) {
            record->field_2E = value;
            return;
        }
    }
    if (class_record->field_34 != 0) {
        if ((u8)func_00195410_helper(class_record->field_34) == (u8)initial_result) {
            record->field_30 = value;
        }
    }
}
