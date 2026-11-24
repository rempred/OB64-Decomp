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
extern u8 *D_801F0B90;
void func_001520E0(void *pal, void *img, u16 w, u16 h, u16 mode);
extern u8 *D_801F36C0;
void func_00155114(s32 a, s32 b) {
    Gfx *g;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xE7000000;
    g->w1 = 0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xD7000002;
    g->w1 = 0x80008000;
    func_001520E0(D_801F36C0 + 0x2E0, D_801F0B90 + 0x27A8, 16, 8, 2);
    func_00151F40(a, b, 0x47);
}
