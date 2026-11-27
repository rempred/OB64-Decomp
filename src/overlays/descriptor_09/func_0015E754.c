#include "game/combat_draw_commands.h"
typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void D_8017C4B4(int);
void D_80179034(void *, int, int);
extern u8 D_80214C30[];
extern signed char *D_80214AF8[];
void func_001524F4(s32 a, s32 b, s32 c, s32 d);
void func_0015E8F0(s32 x, s32 y);
void func_0015EC18(s32 x, s32 y);
void func_0015E754(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        CombatDrawCommand *g = D_800E9BA0;
        s32 i;
        g->first = 0xE7000000;
        g->second = 0;
        D_800E9BA0 = g + 1;
        D_8017C4B4(e[0xC]);
        for (i = 0; i < D_80214C30[(s8)o[0x22]]; i++) {
            s32 dy = i * 16 + 5;
            D_80179034(D_80214AF8[(s8)o[0x22] + i], x + 4, y + dy);
        }
        if (((s8 *)o)[0x23] != 0) {
            func_001524F4((*(s32 *)((u8 *)(o) + (0x7C))), (*(s32 *)((u8 *)(o) + (0x80))) - 12, (*(s32 *)((u8 *)(o) + (0x84))), (*(s32 *)((u8 *)(o) + (0x88))));
            {
                CombatDrawCommand *_g = D_800E9BA0++;
                _g->first = 0xE3001001;
                _g->second = 0x8000;
            }
            {
                CombatDrawCommand *_g = D_800E9BA0++;
                _g->first = 0xD7000002;
                _g->second = 0x80008000;
            }
            if (((s8 *)o)[0x23] == 1) {
                func_0015E8F0(x + 6, y - 10);
            } else if (((s8 *)o)[0x23] == 2) {
                func_0015EC18(x + 6, y - 10);
            }
        }
    }
}
void func_0015E8F0(s32 x, s32 y);
void func_0015EC18(s32 x, s32 y);
