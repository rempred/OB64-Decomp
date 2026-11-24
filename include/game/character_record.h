#ifndef OB64_GAME_CHARACTER_RECORD_H
#define OB64_GAME_CHARACTER_RECORD_H

#include "common/types.h"

/* The common character row. Some tables append four bytes after this prefix. */
typedef struct CharacterRecord {
    u8 name[0x11];
    u8 primary_class_id;
    u8 secondary_class_id;
    u8 level;
    u8 gender;
    u8 field_15;
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
    u8 field_29;
    u16 equipment_slot_0;
    u16 equipment_slot_1;
    u16 equipment_slot_2;
    u16 equipment_slot_3;
    u8 fatigue;
    u8 status_flags;
} CharacterRecord;

/* Extended character row with a separate experience byte at +0x35. */
typedef struct CharacterRecord56 {
    CharacterRecord record;
    u8 field_34;
    u8 experience;
    u8 field_36;
    u8 field_37;
} CharacterRecord56;

/* Class defaults and growth data, indexed by a character's class ID. */
typedef struct CharacterClassRecord {
    u8 field_00[0x05];
    u8 body_code;
    u8 field_06[2];
    u16 base_max_hp;
    u8 max_hp_growth;
    u8 field_0B;
    u16 base_strength;
    u8 strength_growth;
    u8 field_0F;
    u16 base_vitality;
    u8 vitality_growth;
    u8 field_13;
    u16 base_intelligence;
    u8 intelligence_growth;
    u8 field_17;
    u16 base_mentality;
    u8 mentality_growth;
    u8 field_1B;
    u16 base_agility;
    u8 agility_growth;
    u8 field_1F;
    u16 base_dexterity;
    u8 dexterity_growth;
    u8 base_luck;
    u8 base_alignment;
    /* Covers the resistance bytes and movement type at +0x2C. */
    u8 field_25[9];
    u16 default_equipment_slot_0;
    u16 default_equipment_slot_1;
    u16 default_equipment_slot_2;
    u16 default_equipment_slot_3;
    u8 field_36[0x0B];
    u8 first_history_class_id;
    u8 first_history_level_cutoff;
    u8 second_history_class_id;
    u8 second_history_level_cutoff;
    u8 related_class_id;
    u8 element;
    u8 field_47;
} CharacterClassRecord;

typedef char CharacterRecord_size[(sizeof(CharacterRecord) == 0x34) ? 1 : -1];
typedef char CharacterRecord56_size[(sizeof(CharacterRecord56) == 0x38) ? 1 : -1];
typedef char CharacterClassRecord_size[(sizeof(CharacterClassRecord) == 0x48) ? 1 : -1];

extern CharacterRecord D_80195560[];
extern CharacterRecord56 D_80193BC0[];
extern CharacterRecord g_func_0019554C_records_52[];
extern CharacterRecord56 g_func_0019554C_records_56[];
extern CharacterClassRecord g_func_0019554C_class_records[];

void func_0004501C(CharacterRecord *character, int target_level);
void func_8016F11C(CharacterRecord *character, int target_level);
void character_apply_level_up(CharacterRecord *character);
void func_00195410(u16 equipment_id, CharacterRecord *character);
void func_0023A3A0(CharacterRecord *character, u32 class_id, s32 target_level,
                   u32 first_equipment_override, u32 second_equipment_override);

#endif
