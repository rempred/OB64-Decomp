#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void D_8017C4B4(int);
void D_80179034(void *, int, int);
void func_001ACAB0(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    s32 i;
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        u8 *w = (*(u8 * *)((u8 *)(o) + (0xD0)));
        CombatDrawCommand *g = D_800E9BA0;
        g->first = 0xE7000000;
        g->second = 0;
        D_800E9BA0 = g + 1;
        D_8017C4B4(e[0xC]);
        for (i = 0; i < w[0x5F4]; i++) {
            s32 j = w[0x5F1] + i;
            if (j < w[0x5F5]) {
                s32 dy = i * w[0x5F6];
                dy += 5;
                D_80179034(((signed char **)((*(u8 * *)((u8 *)(o) + (0xD0))) + 0x530))[j], x + 6, y + dy);
            }
        }
    }
}
