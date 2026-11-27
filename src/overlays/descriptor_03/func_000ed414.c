#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef unsigned int u32;
typedef float f32;
u8 func_000ed414(u8 mode, f32 y) {
    if ((y >= 350.0f) | (y <= 9.0f) || (y >= 170.0f) & (y <= 189.0f)) {
        if (mode != 1) {
            CombatDrawCommand *g = D_800E9BA0++;
            g->first = 0xFCFFFFFF;
            g->second = 0xFFFDF6FB;
            mode = 1;
        }
    } else if (mode != 2) {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xFCFFFFFF;
        g->second = 0xFFFE773B;
        mode = 2;
    }
    return mode;
}
