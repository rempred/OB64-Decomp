#include "game/icon_coordinate.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_80213648[];
void func_001520E0(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_001520E0(void *pal, void *img, u16 w, u16 h, u16 mode);
extern u8 D_80210AD0[];
extern u8 *D_80214E80;
void func_00153F80(s32 x, s32 y, u8 v) {
    u16 k = v / 14.285714f;
    if (k > 6) {
        k = 6;
    }
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_80213648); };
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xE3000C00;
        _g->w1 = 0;
    }
    func_001520E0(D_80210AD0, D_80214E80 + (k << 8), 32, 16, 2);
    func_00151F40(x, y, 9);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xD7000000;
        _g->w1 = 0x80008000;
    }
}
