#include "game/combat_draw_commands.h"
typedef signed int s32;
typedef unsigned int u32;
extern void *D_801F3654;
void func_00191BCC(s32 x, s32 y) {
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001001); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFD100000); _g->second = ((u32)D_801F3654); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5100000); _g->second = (0x7080200); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE6000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF3000000); _g->second = (0x753F062); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5102A00); _g->second = (0x80200); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF2000000); _g->second = (0x14C03C); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE4000000 | ((((x + 80) << 2) & 0xFFF) << 12) | (((y + 8) << 2) & 0xFFF)); _g->second = ((((x << 2) & 0xFFF) << 12) | ((y << 2) & 0xFFF)); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE1000000); _g->second = (0x100); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF1000000); _g->second = (0x4000400); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001001); _g->second = (0x8000); };
}
