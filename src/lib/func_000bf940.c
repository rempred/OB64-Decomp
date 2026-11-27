#include "game/character_equipment.h"
extern u16 D_8018C414[][16];
s32 func_000bf940(u8 x);
s32 func_000bf940(u8 x) {
    s32 i;
    s32 sum;
    for (i = 0, sum = 0; i < 4; i++) {
        u16 r = D_801EF288[i](x, x);
        if (r != 0) {
            sum += D_8018C414[r][0];
        }
    }
    return sum;
}
