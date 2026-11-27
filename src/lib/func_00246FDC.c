#include "game/combat_draw_commands.h"
typedef signed short s16;
typedef unsigned int u32;
extern s16 D_801D87BC[];
void func_00246FDC(void) {
    if (D_801D87BC[0] < 0xFF) {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3000A01); _g->second = (0); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xD9000000); _g->second = (0); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFA000000); _g->second = (~D_801D87BC[0] & 0xFF); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFCFFFFFF); _g->second = (0xFFFDF6FB); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0x504240); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE44FC3BC); _g->second = (0); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE1000000); _g->second = (0); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF1000000); _g->second = (0); };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    }
}
