#include "game/battle_callbacks.h"

typedef void (*Callback)(s16);

extern s8 D_801CFC70;

void func_0020BD8C(s32 value)
{
    Callback callback = (*(BattleCallbacks **)0x801D0810)->f3;

    if (callback != 0) {
        callback((s16)value);
    } else {
        D_801CFC70 = 0;
    }
}
