typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
#include "game/image_1f_view.h"
void func_001F8DDC(Size1F *a, s32 b, s32 c, s32 d, s32 e, s32 f, s32 g);
extern void *gTitleCardDisplayListCursor;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
u32 func_00201E38(s32 fmt, u32 w);
u32 func_00201E9C(s32 fmt, u32 w);
void func_001FD56C(void *timg, u32 a, u32 b, s32 fmt, s32 siz, s32 stride, s32 height, s32 uls,
s32 ult, s32 lrs, s32 lrt, u32 c, u32 d, u32 e, u32 f, u32 g, u32 h, u32 i);
void func_001F8DDC(Size1F *img, s32 s, s32 t, s32 w, s32 h, s32 x, s32 y) {
    s32 bpr;
    s32 rows;
    s32 i;
    s32 n;
    s32 stride;
    s32 tt;
    if (w == 0) {
        return;
    }
    bpr = func_00201E38(img->unk0[3], w);
    rows = 0x1000 / bpr;
    if (img->unk0[2] == 2) {
        rows = 0x800 / bpr;
    }
    for (i = 0; i < h; i += rows) {
        n = rows;
        if (h - i < rows) {
            n = h - i;
        }
        stride = func_00201E9C(img->unk0[3], img->w);
        tt = t + i;
        func_001FD56C((u8 *)img + 8, 0, 0, img->unk0[2], img->unk0[3], stride, img->h, s, tt,
                                 s + func_00201E9C(img->unk0[3], w) - 1, tt + n - 1, 0, 0, 0, 0, 0,
                                 0, 0);
        { Gfx *_g = (Gfx *)gTitleCardDisplayListCursor; gTitleCardDisplayListCursor = _g + 1; _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
        { Gfx *_g = (Gfx *)gTitleCardDisplayListCursor; gTitleCardDisplayListCursor = _g + 1; _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + w) << 2)) > (0) ? ((s16)((x + w) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + i + n) << 2)) > (0) ? ((s16)((y + i + n) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + i) << 2)) > (0) ? ((s16)((y + i) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)gTitleCardDisplayListCursor; gTitleCardDisplayListCursor = _g + 1; _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((s << 5) - (((s16)(x << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((tt << 5) - ((((y + i) << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)((y + i) << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)((y + i) << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)((y + i) << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)((y + i) << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)gTitleCardDisplayListCursor; gTitleCardDisplayListCursor = _g + 1; _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
        { Gfx *_g = (Gfx *)gTitleCardDisplayListCursor; gTitleCardDisplayListCursor = _g + 1; _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    }
}
u32 func_00201E38(s32 fmt, u32 w);
u32 func_00201E9C(s32 fmt, u32 w);
