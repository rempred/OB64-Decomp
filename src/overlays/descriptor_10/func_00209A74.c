#include "game/combat_draw_commands.h"
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void func_00209A74(s32 x, s32 y, s32 cur, s32 max) {
    s32 f;
    if (cur == max) {
        f = 0;
    } else if (cur == 0) {
        f = 11;
    } else {
        f = 9 - cur / (max / 10);
        f = (f < 0) ? 0 : f + 1;
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 18) << 2)) > (0) ? ((s16)((x + 18) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 8) << 2)) > (0) ? ((s16)((y + 8) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->second = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 1) << 2)) > (0) ? ((s16)((y + 1) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)(((((f / 6) * 640) | 0x20) - (((s16)(x << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((((f % 6) << 8) | 0x20) - ((((y + 1) << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)((y + 1) << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)((y + 1) << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)((y + 1) << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)((y + 1) << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
}
