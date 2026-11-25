#include "game/character_record.h"

enum { CHARACTER_TABLE_CAPACITY = 100 };

/* Write the primary and secondary class IDs from a character table. */
void func_000bd3d0(s32 table_mode, s32 character_index, u8 *primary_class_id,
                   u8 *secondary_class_id)
{
    /* A writable record preserves the load order if an output aliases it. */
    CharacterRecord *character;
    s32 index_mask;
    s32 checked_index;

    index_mask = -((u8)character_index < CHARACTER_TABLE_CAPACITY);
    table_mode &= 0xFF;
    checked_index = character_index & index_mask;
    if (table_mode == 0) {
        character = &D_80193BC0[(u8)checked_index].record;
    } else {
        character = &D_80195560[(u8)checked_index];
    }

    *primary_class_id = character->primary_class_id;
    *secondary_class_id = character->secondary_class_id;
}
