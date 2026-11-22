#ifndef OB64_GAME_BATTLE_PANEL_RECORD_H
#define OB64_GAME_BATTLE_PANEL_RECORD_H

#include "common/types.h"

typedef struct Panel1F {
    u8 unk00[4];
    s16 h4;
    s16 h6;
    s16 h8;
    u8 unk0A[2];
    s16 hC;
    s16 hE;
    s16 h10;
    u8 marks[0x10];
    u8 zero[0x10];
    u8 unk32[0x14];
    u8 b46;
    u8 b47;
} Panel1F;

void func_001F0E04(Panel1F *panel, s32 state);

#endif
