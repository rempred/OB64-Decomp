#include "common/types.h"
#include "game/nu_sc_client.h"

u32 osSetIntMask(u32 mask);
void func_000194e4(NUScClient *c, s16 msgType) {
    u32 mask;
    mask = osSetIntMask(1);
    c->msgType = msgType;
    osSetIntMask(mask);
}
