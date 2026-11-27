#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_80196AF8;
typedef struct {
    u8 pad0[4];
    u8 *img;
    u8 *pal;
} Res87;
extern u8 D_801EE868[];
void func_00087200(void *a, s32 y, s32 k);
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_0008d66c(u8 k, s32 x, s32 y) {
    s32 i = k - 1;
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_801EE868); };
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x80, ((Res87 *)D_80196AF8)->img + 0x5D0, 0x10, 0xC, 2);
    func_00087200((void *)x, y, 0x4F);
    if (k == 0) {
        return;
    }
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x400, ((Res87 *)D_80196AF8)->img + 0x3548, 0x40, 0x24, 2);
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 0x1B) << 2)) > (0) ? ((s16)((x + 0x1B) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 0xC) << 2)) > (0) ? ((s16)((y + 0xC) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->second = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 10) << 2)) > (0) ? ((s16)((x + 10) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << 2)) > (0) ? ((s16)(y << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)((((i % 3 * 17) << 5) - (((s16)((x + 10) << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)((x + 10) << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)((x + 10) << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)((x + 10) << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)((x + 10) << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((((i / 3 * 12) << 5) - (((y << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
}
