#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef unsigned int u32;
extern u8 *D_80196AF8;
typedef struct {
    u32 c[4][4];
} Pal87;
extern Pal87 D_801EF8A8;
void func_00088024(u8 k) {
    Pal87 t = D_801EF8A8;
    if (k < 3) {
        CombatDrawCommand *g = D_800E9BA0++;
        u8 v;
        g->first = 0xFA000000;
        v = D_80196AF8[k * 32 + 0x147];
        g->second = (v << 24) | (v << 16) | (v << 8) | 0xFF;
    } else if (D_80196AF8[0x5E6] != 0) {
        CombatDrawCommand *g = D_800E9BA0++;
        u8 v;
        g->first = 0xFA000000;
        v = D_80196AF8[0x5E6];
        g->second = (v << 24) | (v << 16) | (v << 8) | 0xFF;
    } else {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xFA000000;
        g->second = ((u8)t.c[k - 3][0] << 24) | ((u8)t.c[k - 3][1] << 16) | ((u8)t.c[k - 3][2] << 8) | (u8)t.c[k - 3][3];
    }
}
