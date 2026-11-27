#include "game/combat_draw_commands.h"
typedef signed int s32;
typedef unsigned int u32;
void func_0015F964(s32 x0, s32 x1, s32 y0, s32 y1) {
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE2001E01); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0x504240); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFA000000); _g->second = (0x1236FF90); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFCFFFFFF); _g->second = (0xFFFDF6FB); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE4000000 | (((x1 << 2) & 0xFFF) << 12) | ((y1 << 2) & 0xFFF)); _g->second = ((((x0 << 2) & 0xFFF) << 12) | ((y0 << 2) & 0xFFF)); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE1000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF1000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFCFFFFFF); _g->second = (0xFFFCF279); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0xF0A4000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE2001E01); _g->second = (1); };
}
