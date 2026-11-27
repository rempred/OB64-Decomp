#include "game/combat_draw_commands.h"
void func_001520E0(void *pal, void *img, unsigned short w, unsigned short h, unsigned short mode);
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef double f64;
extern f32 *D_8018F58C;
extern u8 D_80214C7C;
extern u8 D_80212518[];
extern u8 D_80212410[];
extern u8 D_80213648[];
void func_00151F40(s32 x, s32 y, s32 k);
extern f64 D_80214E48;
void func_0015F694(s32 x, s32 y) {
    u8 c;
    s32 b;
    f32 h = *D_8018F58C;
    D_80214C7C = (D_80214C7C + 1) & 7;
    if (h < D_80214E48) {
        y -= 6;
    }
    c = D_80214C7C;
    if (c < 4) {
        b = c;
    } else {
        b = 7 - c;
    }
    {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xE7000000;
        g->second = 0;
    }
    {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xFA000000;
        g->second = -1;
    }
    {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xDE000000;
        g->second = (u32)D_80213648;
    }
    {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xE3000C00;
        g->second = 0;
    }
    {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xE200001C;
        g->second = 0x504240;
    }
    {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xFC119623;
        g->second = 0xFF2FFFFF;
    }
    func_001520E0(D_80212518, D_80212410, 16, 32, 2);
    func_00151F40(x, y + b + 8, 0x3F);
    {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xE7000000;
        g->second = 0;
    }
}
