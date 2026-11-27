#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void func_0015E8F0(s32 x, s32 y);
extern u8 D_80187020;
extern u8 *D_8018FDC0;
void func_00152448(u32 pal);
typedef struct {
    u8 pad0[0xC8];
    u8 *img;
    u8 *pal;
} Sheet15E;
void func_0015E8F0(s32 x, s32 y) {
    s32 step = 10;
    s32 shift = (D_80187020 ? 3 : 0) | 2;
    if (D_80187020) {
        step = 9;
    }
    func_00152448((u32)(((Sheet15E *)D_8018FDC0)->pal + 0x100));
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFD500000); _g->second = ((u32)(((Sheet15E *)D_8018FDC0)->img + 0xF20)); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5500000); _g->second = (0x7000000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE6000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF3000000); _g->second = (0x70FF200); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5400800); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF2000000); _g->second = (0xFC03C); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 0x3F) << shift)) > (0) ? ((s16)((x + 0x3F) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 0x10) << shift)) > (0) ? ((s16)((y + 0x10) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->second = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << shift)) > (0) ? ((s16)(x << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << shift)) > (0) ? ((s16)(y << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)(((0) - (((s16)(x << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
}
