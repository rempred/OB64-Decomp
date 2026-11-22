#include "game/battle_callbacks.h"

extern void *D_801CE8BC;

int func_0020D9C4(void *descriptor)
{
    int i;
    for (i = 0; i < *(int *)((unsigned char *)D_801CE8BC + 0x52BC); i++) {
        void *child = ((void **)((unsigned char *)descriptor + 0xC0))[i];
        BattleChildCallback callback = *(BattleChildCallback *)child;
        callback(child);
    }
    return 1;
}
