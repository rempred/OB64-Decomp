#ifndef OB64_GAME_CHARACTER_RECORD_H
#define OB64_GAME_CHARACTER_RECORD_H

#include "common/types.h"

typedef struct CharacterRecord {
    u8 field_00[0x11];
    u8 field_11;
    u8 field_12;
    u8 field_13;
    u8 field_14;
    u8 field_15;
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
    u8 field_29;
    u16 field_2A;
    u16 field_2C;
    u16 field_2E;
    u16 field_30;
    u8 field_32;
    u8 field_33;
} CharacterRecord;

typedef struct CharacterRecord56 {
    CharacterRecord record;
    u8 field_34;
    u8 field_35;
    u8 field_36;
    u8 field_37;
} CharacterRecord56;

typedef struct CharacterClassRecord {
    u8 field_00[0x05];
    u8 field_05;
    u8 field_06[2];
    u16 field_08;
    u8 growth_0A;
    u8 field_0B;
    u16 field_0C;
    u8 growth_0E;
    u8 field_0F;
    u16 field_10;
    u8 growth_12;
    u8 field_13;
    u16 field_14;
    u8 growth_16;
    u8 field_17;
    u16 field_18;
    u8 growth_1A;
    u8 field_1B;
    u16 field_1C;
    u8 growth_1E;
    u8 field_1F;
    u16 field_20;
    u8 growth_22;
    u8 field_23;
    u8 field_24;
    u8 field_25[9];
    u16 field_2E;
    u16 field_30;
    u16 field_32;
    u16 field_34;
    u8 field_36[0x0B];
    u8 field_41;
    u8 field_42;
    u8 field_43;
    u8 field_44;
    u8 field_45;
    u8 field_46;
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

void func_0004501C(CharacterRecord *record, int level);
void func_8016F11C(CharacterRecord *record, int level);
void func_00044aa4(CharacterRecord *record);
void func_00195410(u16 value, CharacterRecord *record);
void func_0023A3A0(CharacterRecord *record, u32 kind, s32 value, u32 field_a, u32 field_b);

#endif
