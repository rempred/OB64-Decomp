typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} GfxBB;
extern GfxBB *gTitleCardDisplayListCursor;
extern u8 D_8022A821;
extern u8 D_8022A0D0[];
void func_001C27C0(void);
typedef GfxBB Gfx;
extern u8 D_8022A827;
typedef struct {
    s32 n;
    s16 r[1][4];
} RectList1BB;
extern RectList1BB D_8022A720;
void func_001C27C0(void) {
    s32 i;
    if (D_8022A821 == 0) {
        return;
    }
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_8022A0D0); };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(D_8022A827) & ((0x01 << (8)) - 1)) << (0)))); };
    for (i = 0; i < D_8022A720.n; i++) {
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(D_8022A720.r[i][2] * 4) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(D_8022A720.r[i][3] * 4) & ((0x01 << (12)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(D_8022A720.r[i][0] * 4) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(D_8022A720.r[i][1] * 4) & ((0x01 << (12)) - 1)) << (0)))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(1 << 10) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(1 << 10) & ((0x01 << (16)) - 1)) << (0))))); }; };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    }
}
