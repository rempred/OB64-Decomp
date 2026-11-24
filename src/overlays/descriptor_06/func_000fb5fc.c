typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void D_80197B70(void);
void func_000fb5fc(void);
extern u8 D_801B36A0[8];
extern u8 D_801B36A8[8];
void func_000fb5fc(void) {
    s32 i;
    D_80197B70();
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xD9000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFCFFFFFF); _g->w1 = (0xFFFDF6FB); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x504340); };
    for (i = 0; i < 8; i++) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = (D_801B36A0[i]); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (((D_801B36A8[i] + 1) * 4) | 0xE4500000); _g->w1 = (D_801B36A8[i] * 4); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE1000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF1000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
}
