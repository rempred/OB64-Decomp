#include "game/combat_draw_commands.h"
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_801F0DE0;
extern s32 D_801F3658;
s32 func_0010D450(void);
void func_00113C8C(void);
void D_80217640(void);
void func_00104D74(void) {
    switch (D_801F0DE0) {
        case 2:
            if (func_0010D450() == 0) {
                break;
            }
        case 1:
        case 8:
        case 13:
            if (D_801F3658 != -1) {
                func_00113C8C();
            }
            break;
    }
    if (D_801F0DE0 == 0x13) {
        CombatDrawCommand *g = D_800E9BA0++;
        g->first = 0xE7000000;
        g->second = 0;
        D_80217640();
    }
}
