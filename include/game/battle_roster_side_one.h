#ifndef OB64_GAME_BATTLE_ROSTER_SIDE_ONE_H
#define OB64_GAME_BATTLE_ROSTER_SIDE_ONE_H

#include "common/types.h"

typedef struct {
    u8 unk00[0x36];
    u16 items[4];
    u8 unk3E[2];
    u32 flags;
    u8 unk44[4];
    s32 unk48;
    s32 cls;
    u8 unk50[4];
    s32 unk54;
    s32 unk58;
    u8 unk5C[0x14];
    s32 actsMax;
} BattleUnit;

BattleUnit *battle_roster_find_first_side_one(void);

#endif
