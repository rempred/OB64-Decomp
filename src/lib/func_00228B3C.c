#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void func_00227870(u8 *p, s32 a, s32 b);
void func_00228B3C(u8 *p, s32 a, s32 b) {
    CombatDrawCommand *g = D_800E9BA0++;
    u32 i;
    u8 *q;
    g->first = 0xFA000000;
    g->second = -1;
    for (i = 0, q = p + 0x24; i < 5; i++, q += 0xC) {
        func_00227870(q, a, b);
    }
}
