#include "game/combat_draw_commands.h"
unsigned int func_001CE114(int siz, unsigned int w, int h);
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern u8 *D_801B989C;
void func_001EC184(void);
extern Gfx D_801B98B8[];
void * func_001CED40(s32, s32);
void func_001EB308(u8 *s, s32 x, s32 y);
typedef struct {
    u8 pad[4];
    u16 w;
    u16 h;
} ImgHdr1E9;
void func_001EC184(void) {
    u8 *d = D_801B989C;
    u8 *img = (*(u8 * *)((u8 *)(d) + (8)));
    CombatDrawCommand *g;
    if (!(d[0x13B] & 1)) {
        return;
    }
    g = D_800E9BA0++;
    g->first = 0xDE000000;
    g->second = (u32)D_801B98B8;
    g = D_800E9BA0++;
    g->first = 0xFD100000;
    g->second = (u32)(img + (func_001CE114(0, ((ImgHdr1E9 *)img)->w, ((ImgHdr1E9 *)img)->h) + 8));
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE8000000;
        _g->second = 0;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xF5000100;
        _g->second = 0x7000000;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE6000000;
        _g->second = 0;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xF0000000;
        _g->second = 0x703C000;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE7000000;
        _g->second = 0;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xFB000000;
        _g->second = d[0x139] | 0xEFEFEF00;
    }
    func_001EB308((*(u8 * *)((u8 *)(d) + (0x130))), (*(s16 *)((u8 *)(d) + (0x134))), (*(s16 *)((u8 *)(d) + (0x136))));
}
