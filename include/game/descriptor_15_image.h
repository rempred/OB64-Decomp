#ifndef OB64_GAME_DESCRIPTOR_15_IMAGE_H
#define OB64_GAME_DESCRIPTOR_15_IMAGE_H

#include "common/types.h"

typedef struct {
    u8 unk0[4];
    u16 w;
    u16 h;
} SizeCE;

void func_001CF3AC(SizeCE *image, s32 x, s32 y);

#endif
