#include "game/record_name_selection.h"

#include "game/character_record.h"
#include "game/character_template.h"

extern u8 g_func_0019554C_base_level;
extern const char g_func_0019554C_string[];

extern int func_0016C454(void);
extern void func_00023780(void *destination, int size);
extern unsigned char *func_0002C950(unsigned char *destination, const unsigned char *source);

/* Initialize one character from a packed scenario member template. */
void func_0019554C(
    int record_index,
    const CharacterTemplate *source,
    int template_member,
    u8 force_52_byte_pool,
    int source_index_word)
{
    u8 source_index = (u8)source_index_word;
    u8 class_id;
    u8 secondary_class_id;
    unsigned int bounded_source_index;
    int forced_52_byte_pool;
    s16 equipment_word;
    u8 equipment_low_byte;
    s16 equipment_high_shifted;
    CharacterRecord *character;
    CharacterRecord *equipment_target;
    CharacterRecord *finished_character;

    /* Select between the 0x34-byte and 0x38-byte character tables. */
    if ((force_52_byte_pool != 0) | (source_index >= 30)) {
        character = &g_func_0019554C_records_52[record_index];
    } else {
        character = &g_func_0019554C_records_56[record_index].record;
    }

    if (template_member == 0) {
        class_id = source->main_class_id;
    } else if (template_member == 1) {
        class_id = source->second_class_id;
    } else {
        class_id = source->third_class_id;
    }

    character->primary_class_id = class_id;
    secondary_class_id = g_func_0019554C_class_records[class_id].related_class_id;
    if (secondary_class_id == 0) {
        secondary_class_id = class_id;
    }
    character->secondary_class_id = secondary_class_id;

    if (template_member == 0) {
        func_0004501C(character, (u8)(g_func_0019554C_base_level + source->main_level_offset));
    } else if (template_member == 1) {
        func_0004501C(character, (u8)(g_func_0019554C_base_level + source->second_level_offset));
    } else {
        func_0004501C(character, (u8)(g_func_0019554C_base_level + source->third_level_offset));
    }

    character->equipment_slot_0 = 0;
    character->equipment_slot_1 = 0;
    character->equipment_slot_2 = 0;
    character->equipment_slot_3 = 0;

    if (template_member == 0) {
        func_00195410(source->main_equipment_02, character);
        equipment_word = ((const u8 *)source)[4];
        equipment_low_byte = ((const u8 *)source)[5];
        equipment_target = character;
    } else if (template_member == 1) {
        func_00195410(source->second_equipment_09, character);
        equipment_word = ((const u8 *)source)[11];
        equipment_low_byte = ((const u8 *)source)[12];
        equipment_target = character;
    } else {
        func_00195410(source->third_equipment_12, character);
        equipment_word = ((const u8 *)source)[20];
        equipment_low_byte = ((const u8 *)source)[21];
        equipment_target = character;
    }
    equipment_high_shifted = equipment_word << 8;
    equipment_word = equipment_low_byte | equipment_high_shifted;
    finished_character = character;
    if (source->third_equipment_14) {
        if (source->main_equipment_04) {
            func_00195410(equipment_word, equipment_target);
        } else {
            func_00195410(equipment_word, equipment_target);
        }
    } else {
        func_00195410(equipment_word, equipment_target);
    }

    finished_character->fatigue = 0;
    if (template_member == 0) {
        finished_character->status_flags = 0x82;
    } else {
        finished_character->status_flags = 0x80;
    }

    forced_52_byte_pool = force_52_byte_pool != 0;
    bounded_source_index = source_index;
    func_000FC120(forced_52_byte_pool | (bounded_source_index >= 30), (u8)record_index);

    if (func_0016C454() != 0) {
        if ((bounded_source_index == 30) & (template_member == 0)) {
            func_00023780(finished_character, 17);
            func_0002C950(finished_character->name, (const u8 *)g_func_0019554C_string);
        }
    }

    if ((force_52_byte_pool == 0) & (source_index < 30)) {
        CharacterRecord56 *extended_character = (CharacterRecord56 *)finished_character;

        extended_character->field_34 = record_index;
        extended_character->experience = 0;
        extended_character->field_36 = 0;
        extended_character->field_37 = 0;
    }
}
