#include "game/character_record.h"
#include "game/character_equipment.h"

typedef float f32;

typedef struct PreviewStatMultipliers {
    f32 values[3];
} PreviewStatMultipliers;

enum {
    CHARACTER_TABLE_CAPACITY = 100,
    EQUIPMENT_BASE_ADJUSTMENT = 0,
    EQUIPMENT_SECOND_STAT_ADJUSTMENT = 5
};

/* The first two entries of this data owner are three-float preview multiplier sets. */
extern PreviewStatMultipliers data_000dc600[];
extern u8 D_8016D2FC(s32 primary_class_id, s32 secondary_class_id);

/* Calculate the preview value from strength, dexterity and equipment adjustments. */
u16 func_000bddcc(u8 table_mode, u8 character_index, u8 multiplier_index)
{
    PreviewStatMultipliers multipliers = data_000dc600[0];
    CharacterRecord *character;
    u8 selected_mode;
    u8 selected_index;
    u8 primary_class_id;
    u8 secondary_class_id;
    f32 strength;
    f32 dexterity;
    f32 equipment_adjustment;
    u16 unscaled;

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
    strength = character->strength;
    dexterity = character->dexterity + func_000bd60c(
        selected_mode, selected_index, EQUIPMENT_SECOND_STAT_ADJUSTMENT);
    equipment_adjustment = func_000bd60c(
        selected_mode, selected_index, EQUIPMENT_BASE_ADJUSTMENT);
    unscaled = (D_8016D2FC(primary_class_id, secondary_class_id) + equipment_adjustment)
        / 20.0f * (strength + 50.0f) / 50.0f * (dexterity + 100.0f) / 100.0f;
    return unscaled * multipliers.values[(u8)multiplier_index];
}
