#ifndef OB64_COMMON_MUS_DMA_H
#define OB64_COMMON_MUS_DMA_H

#include "common/types.h"

typedef s32 (*ALDMAproc)(s32 address, s32 length, void *state);
typedef ALDMAproc (*ALDMANew)(void *state);

ALDMANew func_000155c0(s32 count, s32 length);
ALDMAproc func_00015804(void *state);
s32 func_00015810(s32 address, s32 length, void *state);

#endif
