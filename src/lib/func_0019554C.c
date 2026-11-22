#include "game/record_name_selection.h"

#include "game/character_record.h"
#include "game/character_template.h"

extern u8 g_func_0019554C_base_level;
extern const char g_func_0019554C_string[];

extern int func_0016C454(void);
extern void func_00023780(void *destination, int size);
extern unsigned char *func_0002C950(unsigned char *destination, const unsigned char *source);

void func_0019554C(
    int record_index,
    const CharacterTemplate *source,
    int selector,
    u8 flag,
    int source_index_word)
{
    u8 source_index = (u8)source_index_word;
    u8 class_id;
    u8 class_value;
    unsigned int bounded_source_index;
    int flag_nonzero;
    s16 combined_value;
    u8 low_value;
    s16 shifted_value;
    CharacterRecord *record;
    CharacterRecord *call_record;
    CharacterRecord *late_record;

    if ((flag != 0) | (source_index >= 30)) {
        record = &g_func_0019554C_records_52[record_index];
    } else {
        record = &g_func_0019554C_records_56[record_index].record;
    }

    if (selector == 0) {
        class_id = source->field_00;
    } else if (selector == 1) {
        class_id = source->field_07;
    } else {
        class_id = source->field_10;
    }

    record->field_11 = class_id;
    class_value = g_func_0019554C_class_records[class_id].field_45;
    if (class_value == 0) {
        class_value = class_id;
    }
    record->field_12 = class_value;

    if (selector == 0) {
        func_0004501C(record, (u8)(g_func_0019554C_base_level + source->field_01));
    } else if (selector == 1) {
        func_0004501C(record, (u8)(g_func_0019554C_base_level + source->field_08));
    } else {
        func_0004501C(record, (u8)(g_func_0019554C_base_level + source->field_11));
    }

    record->field_2A = 0;
    record->field_2C = 0;
    record->field_2E = 0;
    record->field_30 = 0;

    if (selector == 0) {
        func_00195410(source->field_02, record);
        combined_value = ((const u8 *)source)[4];
        low_value = ((const u8 *)source)[5];
        call_record = record;
    } else if (selector == 1) {
        func_00195410(source->field_09, record);
        combined_value = ((const u8 *)source)[11];
        low_value = ((const u8 *)source)[12];
        call_record = record;
    } else {
        func_00195410(source->field_12, record);
        combined_value = ((const u8 *)source)[20];
        low_value = ((const u8 *)source)[21];
        call_record = record;
    }
    shifted_value = combined_value << 8;
    combined_value = low_value | shifted_value;
    late_record = record;
    if (source->field_14) {
        if (source->field_04) {
            func_00195410(combined_value, call_record);
        } else {
            func_00195410(combined_value, call_record);
        }
    } else {
        func_00195410(combined_value, call_record);
    }

    late_record->field_32 = 0;
    if (selector == 0) {
        late_record->field_33 = 0x82;
    } else {
        late_record->field_33 = 0x80;
    }

    flag_nonzero = flag != 0;
    bounded_source_index = source_index;
    func_000FC120(flag_nonzero | (bounded_source_index >= 30), (u8)record_index);

    if (func_0016C454() != 0) {
        if ((bounded_source_index == 30) & (selector == 0)) {
            func_00023780(late_record, 17);
            func_0002C950(late_record->field_00, (const u8 *)g_func_0019554C_string);
        }
    }

    if ((flag == 0) & (source_index < 30)) {
        CharacterRecord56 *full_record = (CharacterRecord56 *)late_record;

        full_record->field_34 = record_index;
        full_record->field_35 = 0;
        full_record->field_36 = 0;
        full_record->field_37 = 0;
    }
}
