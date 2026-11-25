#include "game/character_record.h"

enum { CHARACTER_TABLE_CAPACITY = 100 };

/* Read one of the character's six core stats. */
u16 func_000bd43c(s32 table_mode, s32 character_index, s32 stat_index)
{
    u16 stat = 0;
    const CharacterRecord *character;
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

    switch ((u8)stat_index) {
    case 0:
        stat = character->strength;
        break;
    case 1:
        stat = character->vitality;
        break;
    case 2:
        stat = character->intelligence;
        break;
    case 3:
        stat = character->mentality;
        break;
    case 4:
        stat = character->agility;
        break;
    case 5:
        stat = character->dexterity;
        break;
    }
    return stat;
}
