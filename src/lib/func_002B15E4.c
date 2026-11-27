#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_80197178[];
void D_801B77CC(void *a, void *b, u8 *img, u8 c, s32 d, s32 e);
void func_002B15E4(u8 *o, s32 b, s32 c) {
    CombatDrawCommand *g;
    g = D_800E9BA0++;
    g->first = 0xE7000000;
    g->second = 0;
    if ((o[2] & 3) != 3) {
        g = D_800E9BA0++;
        g->first = 0xE7000000;
        g->second = 0;
        g = D_800E9BA0++;
        g->first = 0xE3000A01;
        g->second = 0x100000;
        g = D_800E9BA0++;
        g->first = 0xE7000000;
        g->second = 0;
        g = D_800E9BA0++;
        g->first = 0xE200001C;
        g->second = 0x0C184240;
        g = D_800E9BA0++;
        g->first = 0xFC21FFFF;
        g->second = 0xFFFFF238;
    }
    D_801B77CC(D_80197178, &D_800E9BA0, o, 1, b, c);
}
