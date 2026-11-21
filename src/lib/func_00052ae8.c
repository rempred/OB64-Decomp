#include "game/cutscene_panels.h"

typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_80187020;
void func_00051a50(void *timg, u16 width, u16 height, s32 cms, s32 cmt, s32 masks, s32 maskt);
typedef struct {
    u8 unk00[0xC8];
    u8 *img;
    u8 *pal;
} SheetPair514;
extern inline void LoadTlut514(void *pal) {
    { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(pal); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE8) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)((256 + (((0) & 0xf) * 16))) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF0) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = ((unsigned int)(((unsigned int)((7)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((15)) & ((0x01 << (10)) - 1)) << (14))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; } };
}
extern inline void Scissor514(void) {
    Gfx *g;
    if (D_80187020) {
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xED000000;
        g->w1 = 0xA00780;
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
    } else {
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xED000000;
        g->w1 = 0x4FC3BC;
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
    }
}
void func_00052ae8(Panel *w, PanelContent *o) {
    s32 step = 10;
    s32 shift = (D_80187020 ? 3 : 0) | 2;
    s32 x;
    s32 y;
    if (D_80187020) {
        step = 9;
    }
    y = w->field30;
    x = w->field2C + 6;
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (14) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (unsigned int)((2 << 14)); };
    Scissor514();
    gTitleCardDisplayListCursor->w0 = 0xD7000002;
    gTitleCardDisplayListCursor->w1 = 0x80008000;
    gTitleCardDisplayListCursor++;
    switch ((u32)o->key & 0xFFFF0000) {
        case 0x30000:
            LoadTlut514(((SheetPair514 *)D_8018FDC0)->pal + 0xE0);
            func_00051a50(((SheetPair514 *)D_8018FDC0)->img + 0xDA0, 48, 16, 0, 0, 0, 0);
            y -= 9;
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 47) << shift)) > (0) ? ((s16)((x + 47) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 16) << shift)) > (0) ? ((s16)((y + 16) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << shift)) > (0) ? ((s16)(x << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << shift)) > (0) ? ((s16)(y << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((0) - (((s16)(x << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (0))))); }; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            break;
        case 0x40000:
            LoadTlut514(((SheetPair514 *)D_8018FDC0)->pal + 0x100);
            func_00051a50(((SheetPair514 *)D_8018FDC0)->img + 0xF20, 64, 16, 0, 0, 0, 0);
            y -= 9;
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 63) << shift)) > (0) ? ((s16)((x + 63) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 16) << shift)) > (0) ? ((s16)((y + 16) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << shift)) > (0) ? ((s16)(x << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << shift)) > (0) ? ((s16)(y << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((0) - (((s16)(x << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (0))))); }; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            break;
        case 0x10000:
            LoadTlut514(((SheetPair514 *)D_8018FDC0)->pal + 0x120);
            func_00051a50(((SheetPair514 *)D_8018FDC0)->img + 0x1120, 48, 16, 0, 0, 0, 0);
            y -= 9;
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 47) << shift)) > (0) ? ((s16)((x + 47) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 16) << shift)) > (0) ? ((s16)((y + 16) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << shift)) > (0) ? ((s16)(x << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << shift)) > (0) ? ((s16)(y << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((0) - (((s16)(x << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (0))))); }; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            break;
        case 0x20000:
            LoadTlut514(((SheetPair514 *)D_8018FDC0)->pal + 0x140);
            func_00051a50(((SheetPair514 *)D_8018FDC0)->img + 0x12A0, 48, 8, 0, 0, 0, 0);
            y -= 5;
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 47) << shift)) > (0) ? ((s16)((x + 47) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 8) << shift)) > (0) ? ((s16)((y + 8) << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << shift)) > (0) ? ((s16)(x << shift)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << shift)) > (0) ? ((s16)(y << shift)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((0) - (((s16)(x << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(x << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(x << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y << shift) < 0) ? (((s16)(1 << step) < 0) ? ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) > (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0))) : ((((((s16)(y << shift) * (s16)(1 << step)) >> 7)) < (0) ? ((((s16)(y << shift) * (s16)(1 << step)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << step)) & ((0x01 << (16)) - 1)) << (0))))); }; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            break;
    }
}
