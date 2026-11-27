#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
extern u8 *D_80196AF8;
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_00088174(void) {
    CombatDrawCommand *g = D_800E9BA0;
    u8 *s = D_80196AF8;
    u8 *img;
    u8 *pal;
    g->first = 0xE3001001;
    g->second = 0x8000;
    img = (*(u8 * *)((u8 *)(s) + (8))) + 0x340;
    pal = (*(u8 * *)((u8 *)(s) + (4))) + 0x2B28;
    D_800E9BA0 = g + 1;
    func_00087b30(img, pal, 0x20, 0x32, 2);
}
