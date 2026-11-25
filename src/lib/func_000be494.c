#include "game/character_record.h"
#include "game/character_equipment.h"

typedef float f32;

enum {
    CHARACTER_TABLE_CAPACITY = 100,
    EQUIPMENT_INTELLIGENCE_ADJUSTMENT = 2,
    EQUIPMENT_MENTALITY_ADJUSTMENT = 3,
    EQUIPMENT_CLASS_ADJUSTMENT = 0
};

extern u8 D_8016D3F8(s32 primary_class_id, s32 secondary_class_id);

/* Calculate the intelligence and mentality preview with the class and equipment modifier. */
u16 func_000be494(u8 table_mode, u8 character_index)
{
    CharacterRecord *character;
    u8 selected_mode;
    u8 selected_index;
    u8 primary_class_id;
    u8 secondary_class_id;
    f32 mentality;
    f32 intelligence;
    f32 class_coefficient;
    s16 equipment_adjustment;
    f32 preview_value;
    f32 class_adjustment;

    character_index = character_index < CHARACTER_TABLE_CAPACITY ? character_index : 0;
    if ((u8)table_mode == 0) {
        character = &D_80193BC0[(u8)character_index].record;
    } else {
        character = &D_80195560[(u8)character_index];
    }

    selected_mode = table_mode;
    selected_index = character_index;
    primary_class_id = character->primary_class_id;
    secondary_class_id = character->secondary_class_id;
    mentality = character->mentality + func_000bd60c(
        selected_mode, selected_index, EQUIPMENT_MENTALITY_ADJUSTMENT);
    intelligence = character->intelligence + func_000bd60c(
        selected_mode, selected_index, EQUIPMENT_INTELLIGENCE_ADJUSTMENT);
    class_coefficient = D_8016D3F8(primary_class_id, secondary_class_id);
    equipment_adjustment = func_000bd8c4(
        selected_mode, selected_index, EQUIPMENT_CLASS_ADJUSTMENT);

    preview_value = class_coefficient / 20.0f
        * (mentality + 25.0f) / 25.0f * (intelligence + 100.0f) / 100.0f;
    class_adjustment = g_func_0019554C_class_records[character->secondary_class_id].field_25[0]
        + equipment_adjustment;
    return preview_value * (class_adjustment + 50.0f) / 75.0f;
}
