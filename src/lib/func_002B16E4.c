#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_80197178[];
void D_801B77CC(void *a, void *b, u8 *img, u8 c, s32 d, s32 e);
void func_002B16E4(u8 *o) {
    CombatDrawCommand *g;
    g = D_800E9BA0++;
    g->first = 0xE7000000;
    g->second = 0;
    g = D_800E9BA0++;
    g->first = 0xD7000002;
    g->second = 0x80008000;
    g = D_800E9BA0++;
    g->first = 0xE7000000;
    g->second = 0;
    g = D_800E9BA0++;
    g->first = 0xE7000000;
    g->second = 0;
    g = D_800E9BA0++;
    g->first = 0xE3000A01;
    g->second = 0;
    g = D_800E9BA0++;
    g->first = 0xE7000000;
    g->second = 0;
    g = D_800E9BA0++;
    g->first = 0xE200001C;
    g->second = 0x0F0A4000;
    g = D_800E9BA0++;
    g->first = 0xFC11FE23;
    g->second = 0xFFFFF3F9;
    D_801B77CC(D_80197178, &D_800E9BA0, o, 0, 0, 0);
}
