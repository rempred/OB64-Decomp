#ifndef OB64_GAME_EFFECT_TASK_700B0_H
#define OB64_GAME_EFFECT_TASK_700B0_H

#include "common/types.h"

/* These callbacks share the task+0x24 payload forwarded to 700B0.
 * This 0x60-byte view fits within the factory's 0x78-byte payload.
 * 700B0 applies its measured volatile access at the use site. */
typedef struct E09Vector700B0 {
    float value_00, value_04, value_08;
    u8 unknown_0C[0x34];
    float value_40;
} E09Vector700B0;
typedef struct E09Object700B0 {
    u8 unknown_00[8];
    u16 value_08, value_0A;
    u8 unknown_0C[4];
    u32 value_10;
    u8 unknown_14[8];
    E09Vector700B0 value_1C;
    u16 value_60, value_62, value_64;
} E09Object700B0;
typedef struct E09State700B0 {
    u8 unknown_00[0x40];
    E09Object700B0 *value_40;
    u32 value_44;
    s16 value_48, value_4A;
    u16 value_4C, value_4E, value_50, value_52;
    u16 value_54, value_56, value_58, value_5A;
    s32 value_5C;
} E09State700B0;

#endif
