#include "game/combat_types.h"

#include "game/battle_roster_record.h"

extern unsigned char D_80195560[];
extern void func_80093380(void *, u32);

static __inline__ int kind1(BattleRosterRecord *record)
{
    if (!record) return 0;
    return record->variant4C.word == 1;
}

/* Initialize a battle row from a 0x34-byte persistent character. */
void func_0020C908(BattleRosterRecord *record, int character_index)
{
    /* The resident table and its 0x34-byte stride keep these halfword fields aligned. */
    unsigned char *character_bytes = D_80195560 + (u32)character_index * 0x34u;
    u32 secondary_class_id;
    func_80093380(record, 0xF8);
    record->class48.word = character_bytes[0x11];
    secondary_class_id = character_bytes[0x12];
    record->fieldF6 = character_index;
    record->variant4C.word = secondary_class_id;
    record->field_31 = character_bytes[0x13];
    record->field_33 = character_bytes[0x1A];
    record->field_22 = *(u16 *)(character_bytes + 0x16);
    record->field20 = *(u16 *)(character_bytes + 0x18);
    record->field_24 = *(u16 *)(character_bytes + 0x1C);
    record->field_26 = *(u16 *)(character_bytes + 0x1E);
    record->field_28 = *(u16 *)(character_bytes + 0x20);
    record->field_2A = *(u16 *)(character_bytes + 0x22);
    record->field_2C = *(u16 *)(character_bytes + 0x24);
    record->field_2E = *(u16 *)(character_bytes + 0x26);
    record->field_30 = character_bytes[0x28];
    record->field_34 = record->field_3F = character_bytes[0x1B];
    record->field_36 = *(u16 *)(character_bytes + 0x2A);
    record->field_38 = *(u16 *)(character_bytes + 0x2C);
    record->field_3A = *(u16 *)(character_bytes + 0x2E);
    record->field_3C = *(u16 *)(character_bytes + 0x30);
    record->field_3E = character_bytes[0x32];
    if (kind1(record)) record->field_3E = 0;
    if (character_bytes[0x33] & 2) record->flags40 |= 0x200;
    if (character_bytes[0x33] & 4) record->flags40 |= 2;
    record->flags40 |= 0x500;
}
