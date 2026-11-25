#ifndef OB64_GAME_CHARACTER_DISPLAY_RECORDS_H
#define OB64_GAME_CHARACTER_DISPLAY_RECORDS_H

#include "common/types.h"

typedef struct DisplayGroupRecord {
    u8 members[5];
    u8 positions[5];
    u8 field_0A;
    u8 items[8];
    u8 field_13[3];
    u8 movement_type;
    u8 field_17[2];
} DisplayGroupRecord;

typedef struct DisplayUnit {
    u32 flags;
    u8 field_04[0x6C];
    s32 field_70;
} DisplayUnit;

extern DisplayGroupRecord D_801971F2[];
extern DisplayUnit *D_801F0CB0[];
extern void *D_801EB290[7];

#endif
