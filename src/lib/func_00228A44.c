#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void func_00226D18(u8 *p, s32 a, s32 b);
void func_00228A44(u8 *p, s32 a, s32 b) {
    CombatDrawCommand *g = D_800E9BA0++;
    g->first = 0xFA000000;
    g->second = 0x00FF00FF;
    func_00226D18(p + 0x24, a, b);
}
