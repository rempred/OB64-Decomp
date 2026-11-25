typedef signed char s8;
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_8019780C;
typedef struct {
    u8 pad[0x28];
    s32 alpha;
    s8 step;
} Fade712;
void func_000775b8(void) {
    { Fade712 *f = (Fade712 *)(D_8019780C); if (f->step != 0) { f->alpha += f->step; if (f->alpha >= 0xFF) { f->alpha = 0xFF; } else if (f->alpha <= 0) { f->alpha = 0; f->step = 0; } { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE3000A01; _g->w1 = 0; } { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xFCFFFFFF; _g->w1 = 0xFFFDF6FB; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE200001C; _g->w1 = 0x5041C8; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xFA000000; _g->w1 = ((u8 *)(D_8019780C))[0x2B]; } { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE45003C0; _g->w1 = 0; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE1000000; _g->w1 = 0; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xF1000000; _g->w1 = 0; } { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; } };
}
