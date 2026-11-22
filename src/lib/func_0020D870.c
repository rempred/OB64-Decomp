#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;

/* The persistent character's two byte values become separate word fields. */
typedef struct CharacterInput {
    u8 pad_00[0x11];
    u8 sourceArt;
    u8 ownerContext;
    u8 field_13;
    u8 pad_14[2];
    u16 field_16;
    u16 field_18;
    u8 field_1A;
    u8 field_1B;
    u16 field_1C;
    u16 field_1E;
    u16 field_20;
    u16 field_22;
    u16 field_24;
    u16 field_26;
    u8 field_28;
    u8 pad_29;
    u16 equipment[4];
    u8 field_32;
    u8 flags;
    u8 pad_34;
    u8 field_35;
    u8 pad_36[2];
} CharacterInput;

extern CharacterInput D_80193BC0[];
extern void func_00023780(void *destination, u32 size);

void func_0020D870(BattleRosterRecord *row, s32 characterIndex)
{
    CharacterInput *character;
    s32 ownerContext;
    s32 isContextOne;
    u8 field_1B;

    character = &D_80193BC0[characterIndex];
    func_00023780(row, sizeof(*row));
    row->class48.word = character->sourceArt;
    ownerContext = character->ownerContext;
    row->fieldF6 = characterIndex;
    row->variant4C.word = ownerContext;
    row->field_31 = character->field_13;
    row->field_33 = character->field_1A;
    row->field_22 = character->field_16;
    row->field20 = character->field_18;
    row->field_24 = character->field_1C;
    row->field_26 = character->field_1E;
    row->field_28 = character->field_20;
    row->field_2A = character->field_22;
    row->field_2C = character->field_24;
    row->field_2E = character->field_26;
    row->field_30 = character->field_28;
    field_1B = character->field_1B;
    row->field_3F = field_1B;
    row->field_34 = field_1B;
    row->field_36 = character->equipment[0];
    row->field_38 = character->equipment[1];
    row->field_3A = character->equipment[2];
    row->field_3C = character->equipment[3];
    row->field_3E = character->field_32;

    if (row == 0) {
        isContextOne = 0;
    } else {
        isContextOne = row->variant4C.word == 1;
    }
    if (isContextOne) {
        row->field_3E = 0;
    }
    if (character->flags & 2) {
        row->flags40 |= 0x200;
    }
    if (character->flags & 4) {
        row->flags40 |= 2;
    }
    row->field_32 = character->field_35;
}
