#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;

/* The two class bytes become separate word fields in the battle row. */
typedef struct CharacterInput {
    u8 pad_00[0x11];
    u8 primary_class_id;
    u8 secondary_class_id;
    u8 level;
    u8 pad_14[2];
    u16 max_hp;
    u16 hp;
    u8 element;
    u8 alignment;
    u16 strength;
    u16 vitality;
    u16 intelligence;
    u16 mentality;
    u16 agility;
    u16 dexterity;
    u8 luck;
    u8 pad_29;
    u16 equipment[4];
    u8 fatigue;
    u8 status_flags;
    u8 pad_34;
    u8 experience;
    u8 pad_36[2];
} CharacterInput;

extern CharacterInput D_80193BC0[];
extern void func_00023780(void *destination, u32 size);

/* Initialize a battle row from a 0x38-byte persistent character. */
void func_0020D870(BattleRosterRecord *row, s32 characterIndex)
{
    CharacterInput *character;
    s32 secondary_class_id;
    s32 uses_class_one;
    u8 alignment;

    character = &D_80193BC0[characterIndex];
    func_00023780(row, sizeof(*row));
    row->class48.word = character->primary_class_id;
    secondary_class_id = character->secondary_class_id;
    row->fieldF6 = characterIndex;
    row->variant4C.word = secondary_class_id;
    row->field_31 = character->level;
    row->field_33 = character->element;
    row->field_22 = character->max_hp;
    row->field20 = character->hp;
    row->field_24 = character->strength;
    row->field_26 = character->vitality;
    row->field_28 = character->intelligence;
    row->field_2A = character->mentality;
    row->field_2C = character->agility;
    row->field_2E = character->dexterity;
    row->field_30 = character->luck;
    alignment = character->alignment;
    row->field_3F = alignment;
    row->field_34 = alignment;
    row->field_36 = character->equipment[0];
    row->field_38 = character->equipment[1];
    row->field_3A = character->equipment[2];
    row->field_3C = character->equipment[3];
    row->field_3E = character->fatigue;

    if (row == 0) {
        uses_class_one = 0;
    } else {
        uses_class_one = row->variant4C.word == 1;
    }
    if (uses_class_one) {
        row->field_3E = 0;
    }
    if (character->status_flags & 2) {
        row->flags40 |= 0x200;
    }
    if (character->status_flags & 4) {
        row->flags40 |= 2;
    }
    row->field_32 = character->experience;
}
