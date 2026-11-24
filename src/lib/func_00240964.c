typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
s32 D_801BE9A8(s32 siz, s32 w);
void D_801BA0DC(void *timg, s32 a, s32 b, s32 fmt, s32 siz, s32 stride, s32 height, s32 uls, s32 ult,
s32 lrs, s32 lrt, s32 c, s32 d, s32 e, s32 f, s32 g, s32 h, s32 i);
typedef union { struct { u32 w0, w1; } words; long long force_align[1]; } GfxU23;
s32 D_801BEA0C(s32 siz, s32 w);
typedef struct { u8 pad0[3]; u8 siz; u16 w; u16 h; u8 data[1]; } Img23;
void func_00240964(Img23 *img, s16 x, s16 y) {
    s32 stride = D_801BE9A8(2, img->w);
    Img23 *mask = (Img23 *)((u8 *)img + (stride * img->h + 8));
    s32 band = 0x800 / stride;
    s32 row;
    s32 n;
    for (row = 0; row < img->h; row += band) {
        n = band;
        if (img->h - row < band) {
            n = img->h - row;
        }
        D_801BA0DC(mask->data, 0x100, 0, 4, 1, D_801BEA0C(1, mask->w), mask->h, 0, row,
                      D_801BEA0C(1, mask->w) - 1, row + n - 1, 0, 0, 0, 0, 0, 0, 0);
        D_801BA0DC(img->data, 0, 1, 0, 2, D_801BEA0C(2, img->w), img->h, 0, row,
                      D_801BEA0C(2, img->w) - 1, row + n - 1, 0, 0, 0, 0, 0, 0, 0);
        { GfxU23 *_g = (GfxU23 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (u32)(0); };
        { GfxU23 *_g = (GfxU23 *)(gTitleCardDisplayListCursor++); _g->words.w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + img->w) << 2)) > (0) ? ((s16)((x + img->w) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + row + n) << 2)) > (0) ? ((s16)((y + row + n) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->words.w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + row) << 2)) > (0) ? ((s16)((y + row) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { GfxU23 *_g = (GfxU23 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE1 << 24); _g->words.w1 = (u32)(((unsigned int)(((unsigned int)(((D_801BEA0C(img->siz, img->w) - 1) << 5) - (((s16)(x << 2) < 0) ? (((s16)(-1024) < 0) ? ((((s16)(x << 2) * (s16)(-1024)) >> 7) > (0) ? (((s16)(x << 2) * (s16)(-1024)) >> 7) : (0)) : (((((s16)(x << 2) * (s16)(-1024)) >> 7) < (0)) ? (((s16)(x << 2) * (s16)(-1024)) >> 7) : (0))) : 0)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((row << 5) - ((((y + row) << 2) < 0) ? (((s16)(1024) < 0) ? ((((s16)((y + row) << 2) * (s16)(1024)) >> 7) > (0) ? (((s16)((y + row) << 2) * (s16)(1024)) >> 7) : (0)) : (((((s16)((y + row) << 2) * (s16)(1024)) >> 7) < (0)) ? (((s16)((y + row) << 2) * (s16)(1024)) >> 7) : (0))) : 0)) & ((0x01 << (16)) - 1)) << (0)))); }; { GfxU23 *_g = (GfxU23 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xF1 << 24); _g->words.w1 = (u32)(((unsigned int)(((unsigned int)((-1024)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1024)) & ((0x01 << (16)) - 1)) << (0)))); }; };
        { GfxU23 *_g = (GfxU23 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (u32)(0); };
        { GfxU23 *_g = (GfxU23 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (u32)(0); };
    }
}
void func_00240964(Img23 *img, s16 x, s16 y);
