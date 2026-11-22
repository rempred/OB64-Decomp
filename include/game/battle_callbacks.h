#ifndef GAME_BATTLE_CALLBACKS_H
#define GAME_BATTLE_CALLBACKS_H

#include "common/types.h"

/* Prefix shared by the descriptor 10 callback dispatchers. */
typedef struct {
    s32 (*f0)(void);
    void (*f1)(void);
    void (*f2)(s32);
    void (*f3)(s16);
    void (*f4)(s16, s32);
} BattleCallbacks;

extern BattleCallbacks *D_801D0810;

#endif
