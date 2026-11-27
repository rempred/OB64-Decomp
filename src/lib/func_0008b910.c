#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct {
    u8 pad0[0xC];
    s32 x;
    s32 y;
    s32 w;
    s32 h;
    u8 pad1C[0xE0 - 0x1C];
    s16 alpha[1];
} WinG87;
extern Gfx D_06004C10[];
void func_0008b910(WinG87 *w, u8 top, u8 n) {
    s32 x = w->w - 4;
    s32 y = w->y + 6;
    s32 y2 = w->h - 12;
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)(D_06004C10); };
    if (top) {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 7) << 2)) > (0) ? ((s16)((x + 7) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 7) << 2)) > (0) ? ((s16)((y + 7) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->second = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << 2)) > (0) ? ((s16)(y << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)(((0) - (((s16)(x << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    }
    if (top < n) {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 7) << 2)) > (0) ? ((s16)((x + 7) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y2 + 7) << 2)) > (0) ? ((s16)((y2 + 7) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->second = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y2 << 2)) > (0) ? ((s16)(y2 << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)(((8 << 5) - (((s16)(x << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y2 << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(y2 << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(y2 << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(y2 << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(y2 << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    }
}
