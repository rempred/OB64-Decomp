typedef unsigned char u8;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_80187020;
void func_00051c48(void) {
    if (D_80187020) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xED000000); _g->w1 = (0xA00780); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    } else {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xED000000); _g->w1 = (0x4FC3BC); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    }
}
