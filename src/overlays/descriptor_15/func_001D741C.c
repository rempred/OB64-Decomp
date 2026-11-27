#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801B81B0;
void func_001D6148(u8 *o, s32 a, s32 b, s32 c);
extern inline u8 *Panel1D4(u32 i) {
    u8 *r = ((void *)0);
    if (i < 13) {
        u8 *e = D_801B81B0 + i * 0x90;
        r = (u8 *)((s32)e & -((*(s32 *)((u8 *)(e) + (0x4C))) != 0));
    }
    return r;
}
void func_001D741C(void) {
    CombatDrawCommand *g;
    s32 i;
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
    g->first = 0xE3001001;
    g->second = 0;
    for (i = 6; i < 12; i++) {
        u8 *o = Panel1D4(i);
        if (o != ((void *)0)) {
            func_001D6148(o, 1, 0, 0);
        }
    }
}
