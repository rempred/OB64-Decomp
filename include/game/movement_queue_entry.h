#ifndef OB64_GAME_MOVEMENT_QUEUE_ENTRY_H
#define OB64_GAME_MOVEMENT_QUEUE_ENTRY_H

#include "common/types.h"

typedef struct MovementQueueEntry {
    s16 field00;
    s16 field02;
    s16 field04;
    u16 field06;
    u32 field08;
} MovementQueueEntry;

s32 func_00107850(MovementQueueEntry *, s32 *, s32 *, s32, u32);

#endif
