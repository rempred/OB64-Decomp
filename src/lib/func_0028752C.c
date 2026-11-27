#include "game/combat_draw_commands.h"
unsigned int func_0028acdc(int format, unsigned int width);
#include "game/title_image_header.h"
void func_0028752C(TitleImageHeader *s, s32 a, s32 b, s32 c, s32 d, s32 e, s32 f);
s32 func_0028ac88(s32, u32);
void func_00291194(s32, u8 *);
void func_00286BD0(void *timg, s32 a, s32 b, s32 fmt, s32 siz, s32 stride, s32 height, s32 uls,
s32 ult, s32 lrs, s32 lrt, s32 c, s32 d, s32 e, s32 f, s32 g, s32 h, s32 i);
void func_0028752C(TitleImageHeader *img, s32 s, s32 t, s32 w, s32 h, s32 x, s32 y) {
    s32 bpr;
    s32 rows;
    s32 i;
    s32 n;
    s32 stride;
    s32 tt;
    bpr = func_0028ac88(img->field03, w);
    rows = 0x1000 / bpr;
    if (img->pad00[2] == 2) {
        rows = 0x800 / bpr;
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    for (i = 0; i < h; i += rows) {
        n = rows;
        if (h - i < rows) {
            n = h - i;
        }
        stride = func_0028acdc(img->field03, img->width);
        tt = t + i;
        func_00286BD0((u8 *)img + 8, 0, 0, img->pad00[2], img->field03, stride, img->height, s, tt,
                                 s + func_0028acdc(img->field03, w) - 1, tt + n - 1, 0, 0, 0, 0, 0,
                                 0, 0);
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + w) << 2)) > (0) ? ((s16)((x + w) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + i + n) << 2)) > (0) ? ((s16)((y + i + n) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->second = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + i) << 2)) > (0) ? ((s16)((y + i) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)(((s << 5) - (((s16)(x << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((tt << 5) - ((((y + i) << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)((y + i) << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)((y + i) << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)((y + i) << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)((y + i) << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
}
