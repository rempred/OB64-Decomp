#include "game/character_record.h"

extern int func_0002CBCC(void);

/* Select the growth class for the current level from the class-history thresholds. */
static __inline__ u8 func_0004501C_select_loop(
    u8 primary_class_id, u8 secondary_class_id, int primary_class_offset,
    int secondary_class_byte, int current_level, int no_transition_level)
{
    u8 growth_class_index;
    u8 history_level;

    history_level = current_level;
    if (*((u8 *)g_func_0019554C_class_records + primary_class_offset + 0x45) != secondary_class_byte) {
        growth_class_index = secondary_class_id;
    } else {
        growth_class_index = primary_class_id;
    }

    if (g_func_0019554C_class_records[growth_class_index].field_42 != (no_transition_level + no_transition_level - no_transition_level) &&
        (u8)history_level < g_func_0019554C_class_records[growth_class_index].field_42) {
        growth_class_index = g_func_0019554C_class_records[growth_class_index].field_41;
        goto transition_done;
    }
    if (g_func_0019554C_class_records[growth_class_index].field_44 != no_transition_level &&
        (u8)history_level < g_func_0019554C_class_records[growth_class_index].field_44) {
        growth_class_index = g_func_0019554C_class_records[growth_class_index].field_43;
    }
transition_done:
    return growth_class_index;
}

/* Initialize character stats at level one and replay class growth to the requested level. */
void func_0004501C(CharacterRecord *character, int target_level)
{
    u8 primary_class_id;
    u8 secondary_class_id;
    u8 growth_class_index;
    u8 selected_class;

    u8 class_element;
    u8 class_alignment;
    int starting_alignment;
    u8 level_growth_class;
    int counter;
    int levels_reached;
    int current_level;
    int primary_class_offset;
    int secondary_class_byte;
    int no_transition_level;
    int class_lookup_value;
    int class_lookup_offset_or_code;

    CharacterClassRecord *starting_class;
    CharacterRecord *character_to_level;

    primary_class_id = character->field_11;
    secondary_class_id = character->field_12;

    if (g_func_0019554C_class_records[primary_class_id].field_45 != secondary_class_id) {
        growth_class_index = secondary_class_id;
    } else {
        growth_class_index = primary_class_id;
    }

    if (g_func_0019554C_class_records[growth_class_index].field_42 != 0xFF) {
        int first_start_level;

        first_start_level = 1;
        if ((u8)first_start_level < g_func_0019554C_class_records[growth_class_index].field_42) {
            growth_class_index = g_func_0019554C_class_records[growth_class_index].field_41;
            goto initial_transition_done;
        }
    }
    if (g_func_0019554C_class_records[growth_class_index].field_44 != 0xFF) {
        int second_start_level;

        second_start_level = 1;
        if ((u8)second_start_level < g_func_0019554C_class_records[growth_class_index].field_44) {
            growth_class_index = g_func_0019554C_class_records[growth_class_index].field_43;
            goto initial_transition_done;
        }
    }
initial_transition_done:
    class_lookup_value = (growth_class_index << 3) + growth_class_index;
    class_lookup_offset_or_code = class_lookup_value << 3;
    counter = growth_class_index;
    do {
        class_lookup_value = *((u8 *)g_func_0019554C_class_records + class_lookup_offset_or_code + 5);
        class_lookup_offset_or_code = (u8)class_lookup_value;
    } while (0);

    if (class_lookup_offset_or_code == 3) {
        character->field_14 = 0;
    } else if (class_lookup_offset_or_code == 4) {
        character->field_14 = func_0002CBCC() & 1;
    } else {
        character->field_14 = class_lookup_value;
    }

    /* Seed the level-one stats from the starting class in the character's history. */
    starting_class = &g_func_0019554C_class_records[counter];
    character->field_16 = starting_class->field_08;
    character->field_1C = starting_class->field_0C;
    character->field_1E = starting_class->field_10;
    character->field_20 = starting_class->field_14;
    character->field_22 = starting_class->field_18;
    character->field_24 = starting_class->field_1C;
    character->field_26 = starting_class->field_20;

    if (g_func_0019554C_class_records[primary_class_id].field_45 == secondary_class_id) {
        class_element = g_func_0019554C_class_records[primary_class_id].field_46;
    } else {
        class_element = g_func_0019554C_class_records[secondary_class_id].field_46;
    }
    character_to_level = character;
    if (class_element == 0xFF) {
        character_to_level->field_1A = (func_0002CBCC() % 4) + 1;
    } else {
        character_to_level->field_1A = class_element;
    }

    if (g_func_0019554C_class_records[primary_class_id].field_45 == secondary_class_id) {
        class_alignment = g_func_0019554C_class_records[primary_class_id].field_24;
        starting_alignment = class_alignment;
        counter = 1;
    } else {
        class_alignment = g_func_0019554C_class_records[secondary_class_id].field_24;
        starting_alignment = class_alignment;
        counter = 1;
    }
    levels_reached = counter;
    character_to_level->field_1B = starting_alignment;
    character_to_level->field_13 = 1;

    /* Use the historical class for each level, then restore the original class IDs. */
    if (levels_reached >= (u8)target_level) {
        goto loop_done;
    }
    primary_class_offset = primary_class_id * 0x48;
    secondary_class_byte = (u8)secondary_class_id;
    no_transition_level = 0xFF;

loop_body:
    current_level = levels_reached;
    level_growth_class = func_0004501C_select_loop(
        primary_class_id, secondary_class_id, primary_class_offset,
        secondary_class_byte, current_level, no_transition_level);

    character_to_level->field_12 = level_growth_class;
    character_to_level->field_11 = level_growth_class;
    character_apply_level_up(character_to_level);
    levels_reached++;
    if (levels_reached < (u8)target_level) {
        goto loop_body;
    }

loop_done:
    ;

    character_to_level->field_18 = character_to_level->field_16;
    character_to_level->field_11 = primary_class_id;
    character_to_level->field_12 = secondary_class_id;

    if (g_func_0019554C_class_records[primary_class_id].field_45 == secondary_class_id) {
        character_to_level->field_28 = g_func_0019554C_class_records[primary_class_id].field_23;
    } else {
        character_to_level->field_28 = g_func_0019554C_class_records[secondary_class_id].field_23;
    }
}
