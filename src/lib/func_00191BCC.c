typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern void *D_801F3654;
void func_00191BCC(s32 x, s32 y) {
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001001); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFD100000); _g->w1 = ((u32)D_801F3654); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5100000); _g->w1 = (0x7080200); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE6000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF3000000); _g->w1 = (0x753F062); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5102A00); _g->w1 = (0x80200); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF2000000); _g->w1 = (0x14C03C); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE4000000 | ((((x + 80) << 2) & 0xFFF) << 12) | (((y + 8) << 2) & 0xFFF)); _g->w1 = ((((x << 2) & 0xFFF) << 12) | ((y << 2) & 0xFFF)); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE1000000); _g->w1 = (0x100); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF1000000); _g->w1 = (0x4000400); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001001); _g->w1 = (0x8000); };
}
