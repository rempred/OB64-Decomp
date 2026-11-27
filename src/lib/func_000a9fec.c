#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern u8 *D_80196AF8;
extern Gfx D_801EEFB0[];
extern Gfx D_801EEF70[];
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_000a9fec(void) {
    CombatDrawCommand *g = D_800E9BA0;
    u8 *s = D_80196AF8;
    u8 *pal;
    u8 *img;
    g->first = 0xDE000000;
    g->second = (u32)D_801EEFB0;
    pal = (*(u8 * *)((u8 *)(s) + (8)));
    img = (*(u8 * *)((u8 *)(s) + (4)));
    D_800E9BA0 = g + 1;
    func_00087b30(pal + 0x1C0, img + 0x1668, 32, 32, 3);
    g = D_800E9BA0++;
    g->first = 0x01004008;
    g->second = (u32)D_801EEF70;
    g = D_800E9BA0++;
    g->first = 0x06000204;
    g->second = 0x406;
    g = D_800E9BA0++;
    g->first = 0xE7000000;
    g->second = 0;
    g = D_800E9BA0++;
    g->first = 0xD7000000;
    g->second = 0x80008000;
}
