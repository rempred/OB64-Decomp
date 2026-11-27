#include "game/character_equipment.h"
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
int D_8016B6FC(int);
extern StockEntry D_80196B00[];
s32 func_000bf88c(u8 x);
s32 func_000bf88c(u8 x) {
    s32 i;
    s32 r;
    for (i = 0, r = 0; i < 4; i++) {
        u16 k = D_801EF288[i](x, x);
        if (k != 0) {
            u16 slot = D_8016B6FC(k);
            if (slot != 0x1FF && D_80196B00[slot].count >= 99) {
                r = 1;
            }
        }
    }
    return r;
}
