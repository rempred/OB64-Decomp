#include "game/character_record.h"
#include "game/class_field_lookups.h"
#include "game/record_name_selection.h"
#include "game/class_entry.h"

extern ClassEntry D_80187C40[];
extern unsigned char *func_8009C550(unsigned char *destination, const unsigned char *source);
extern u8 func_8016F5C8(s32 value);
extern u8 func_8016DE70(s32 first, s32 second);
extern int func_8009C7CC(void);

void func_0023A3A0(CharacterRecord *record, u32 kind, s32 value,
                   u32 field_a, u32 field_b)
{
    u32 related = D_80187C40[kind].related_class_19;
    u8 category;
    u32 final_category;

    if (related == 0) {
        related = kind;
    }
    func_8009C550(record->field_00, func_8016E1DC((u8)kind, (u8)related));
    record->field_11 = kind;
    record->field_12 = related;
    record->field_13 = value;
    record->field_2A = func_8016DF88((u8)kind, (u8)related);
    record->field_2C = func_8016DFDC((u8)kind, (u8)related);
    record->field_2E = func_8016E030((u8)kind, (u8)related);
    record->field_30 = func_8016E084((u8)kind, (u8)related);

    if (field_a != 0) {
        category = func_8016F5C8((u16)field_a);
        if (func_8016F5C8(record->field_2A) == category) {
            record->field_2A = field_a;
        }
        if (func_8016F5C8(record->field_2C) == category) {
            record->field_2C = field_a;
        }
        if (func_8016F5C8(record->field_2E) == category) {
            record->field_2E = field_a;
        }
        if (func_8016F5C8(record->field_30) == category) {
            record->field_30 = field_a;
        }
    }
    if (field_b != 0) {
        category = func_8016F5C8((u16)field_b);
        if (func_8016F5C8(record->field_2A) == category) {
            record->field_2A = field_b;
        }
        if (func_8016F5C8(record->field_2C) == category) {
            record->field_2C = field_b;
        }
        if (func_8016F5C8(record->field_2E) == category) {
            record->field_2E = field_b;
        }
        if (func_8016F5C8(record->field_30) == category) {
            record->field_30 = field_b;
        }
    }
    func_8016F11C(record, (u8)value);
    func_000FC120(1, record - D_80195560);
    final_category = func_8016DE70((u8)kind, (u8)related);
    if (final_category == 3) {
        record->field_14 = 0;
    } else if (final_category == 4) {
        record->field_14 = func_8009C7CC() & 1;
    } else {
        record->field_14 = final_category;
    }
}
