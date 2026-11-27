#include "game/combat_draw_commands.h"
typedef signed char s8;
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801951AC;
typedef struct {
    u8 pad[0x28];
    s32 alpha;
    s8 step;
} Fade712;
void func_00075998(void) {
    { Fade712 *f = (Fade712 *)(D_801951AC + 0x60); if (f->step != 0) { f->alpha += f->step; if (f->alpha >= 0xFF) { f->alpha = 0xFF; } else if (f->alpha <= 0) { f->alpha = 0; f->step = 0; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE3000A01; _g->second = 0; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xFCFFFFFF; _g->second = 0xFFFDF6FB; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE200001C; _g->second = 0x5041C8; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xFA000000; _g->second = ((u8 *)(D_801951AC + 0x60))[0x2B]; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE45003C0; _g->second = 0; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE1000000; _g->second = 0; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xF1000000; _g->second = 0; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; }; } };
}
