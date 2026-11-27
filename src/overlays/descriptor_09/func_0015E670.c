#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern signed char D_80214A58[];
extern signed char D_80214A5C[];
extern s32 D_80214F4C;
void D_8017C4B4(int);
void D_80179034(void *, int, int);
void D_801818A0(s32 x, s32 y);
void func_0015E670(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        u8 b = o[0x22];
        CombatDrawCommand *g = D_800E9BA0;
        s32 dy;
        s32 c;
        g->first = 0xE7000000;
        g->second = 0;
        D_800E9BA0 = g + 1;
        dy = (b & 1) * 14 + 4;
        D_8017C4B4(e[0xC]);
        D_80179034(D_80214A58, x + 0x15, y + 2);
        D_80179034(D_80214A5C, x + 0x15, y + 0xE);
        {
            s32 d = D_80214F4C;
            if (d < 4) {
                c = d;
            } else {
                c = 7 - d;
            }
        }
        D_801818A0(x + c - 2, y + dy);
    }
}
