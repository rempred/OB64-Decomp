#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void func_00226D18(u8 *p, s32 a, s32 b);
void func_002272F8(u8 *p, s32 a, s32 b);
void func_00228CBC(u8 *p, s32 a, s32 b) {
    CombatDrawCommand *g = D_800E9BA0++;
    g->first = 0xFA000000;
    g->second = p[0x7F] | 0xFFFFFF00;
    func_002272F8(p + 0x24, a, b);
    g = D_800E9BA0++;
    g->first = 0xFA000000;
    g->second = p[0x7F] | 0xF8F0A800;
    func_00226D18(p + 0x54, a, b);
}
