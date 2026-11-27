#include "game/combat_draw_commands.h"
typedef unsigned int u32;
void D_80200A38(void);
void func_00191DAC(void) {
    CombatDrawCommand *g;
    D_80200A38();
    g = D_800E9BA0++;
    g->first = 0xE7000000;
    g->second = 0;
}
