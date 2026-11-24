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

    if (g_func_0019554C_class_records[growth_class_index].first_history_level_cutoff != (no_transition_level + no_transition_level - no_transition_level) &&
        (u8)history_level < g_func_0019554C_class_records[growth_class_index].first_history_level_cutoff) {
        growth_class_index = g_func_0019554C_class_records[growth_class_index].first_history_class_id;
        goto transition_done;
    }
    if (g_func_0019554C_class_records[growth_class_index].second_history_level_cutoff != no_transition_level &&
        (u8)history_level < g_func_0019554C_class_records[growth_class_index].second_history_level_cutoff) {
        growth_class_index = g_func_0019554C_class_records[growth_class_index].second_history_class_id;
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

    primary_class_id = character->primary_class_id;
    secondary_class_id = character->secondary_class_id;

    if (g_func_0019554C_class_records[primary_class_id].related_class_id != secondary_class_id) {
        growth_class_index = secondary_class_id;
    } else {
        growth_class_index = primary_class_id;
    }

    if (g_func_0019554C_class_records[growth_class_index].first_history_level_cutoff != 0xFF) {
        int first_start_level;

        first_start_level = 1;
        if ((u8)first_start_level < g_func_0019554C_class_records[growth_class_index].first_history_level_cutoff) {
            growth_class_index = g_func_0019554C_class_records[growth_class_index].first_history_class_id;
            goto initial_transition_done;
        }
    }
    if (g_func_0019554C_class_records[growth_class_index].second_history_level_cutoff != 0xFF) {
        int second_start_level;

        second_start_level = 1;
        if ((u8)second_start_level < g_func_0019554C_class_records[growth_class_index].second_history_level_cutoff) {
            growth_class_index = g_func_0019554C_class_records[growth_class_index].second_history_class_id;
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
        character->gender = 0;
    } else if (class_lookup_offset_or_code == 4) {
        character->gender = func_0002CBCC() & 1;
    } else {
        character->gender = class_lookup_value;
    }

    /* Seed the level-one stats from the starting class in the character's history. */
    starting_class = &g_func_0019554C_class_records[counter];
    character->max_hp = starting_class->base_max_hp;
    character->strength = starting_class->base_strength;
    character->vitality = starting_class->base_vitality;
    character->intelligence = starting_class->base_intelligence;
    character->mentality = starting_class->base_mentality;
    character->agility = starting_class->base_agility;
    character->dexterity = starting_class->base_dexterity;

    if (g_func_0019554C_class_records[primary_class_id].related_class_id == secondary_class_id) {
        class_element = g_func_0019554C_class_records[primary_class_id].element;
    } else {
        class_element = g_func_0019554C_class_records[secondary_class_id].element;
    }
    character_to_level = character;
    if (class_element == 0xFF) {
        character_to_level->element = (func_0002CBCC() % 4) + 1;
    } else {
        character_to_level->element = class_element;
    }

    if (g_func_0019554C_class_records[primary_class_id].related_class_id == secondary_class_id) {
        class_alignment = g_func_0019554C_class_records[primary_class_id].base_alignment;
        starting_alignment = class_alignment;
        counter = 1;
    } else {
        class_alignment = g_func_0019554C_class_records[secondary_class_id].base_alignment;
        starting_alignment = class_alignment;
        counter = 1;
    }
    levels_reached = counter;
    character_to_level->alignment = starting_alignment;
    character_to_level->level = 1;

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

    character_to_level->secondary_class_id = level_growth_class;
    character_to_level->primary_class_id = level_growth_class;
    character_apply_level_up(character_to_level);
    levels_reached++;
    if (levels_reached < (u8)target_level) {
        goto loop_body;
    }

loop_done:
    ;

    character_to_level->hp = character_to_level->max_hp;
    character_to_level->primary_class_id = primary_class_id;
    character_to_level->secondary_class_id = secondary_class_id;

    if (g_func_0019554C_class_records[primary_class_id].related_class_id == secondary_class_id) {
        character_to_level->luck = g_func_0019554C_class_records[primary_class_id].base_luck;
    } else {
        character_to_level->luck = g_func_0019554C_class_records[secondary_class_id].base_luck;
    }
}
