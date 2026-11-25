typedef signed short s16;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern s16 D_801D87BC[];
void func_00246FDC(void) {
    if (D_801D87BC[0] < 0xFF) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xD9000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = (~D_801D87BC[0] & 0xFF); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFCFFFFFF); _g->w1 = (0xFFFDF6FB); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x504240); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE44FC3BC); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE1000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF1000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    }
}
