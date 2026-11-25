typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_0015F964(s32 x0, s32 x1, s32 y0, s32 y1) {
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE2001E01); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x504240); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = (0x1236FF90); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFCFFFFFF); _g->w1 = (0xFFFDF6FB); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE4000000 | (((x1 << 2) & 0xFFF) << 12) | ((y1 << 2) & 0xFFF)); _g->w1 = ((((x0 << 2) & 0xFFF) << 12) | ((y0 << 2) & 0xFFF)); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE1000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF1000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFCFFFFFF); _g->w1 = (0xFFFCF279); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0xF0A4000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE2001E01); _g->w1 = (1); };
}
