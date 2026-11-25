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
extern u8 *D_80196AF8;
typedef struct {
    u8 pad0[4];
    u8 *img;
    u8 *pal;
} Res87;
extern u8 D_801EE868[];
typedef union {
    struct {
        u32 w0;
        u32 w1;
    } words;
    long long force_align[1];
} GfxU87;
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_0008b234(s32 x, s32 y, s32 a) {
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = ((u32)D_801EE868); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001201); _g->w1 = (0x2000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = ((a <= 0x50) ? (a | 0xFFFFFF00) : 0xFFFFFF50); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE200001C); _g->words.w1 = (0x504240); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xFC119623); _g->words.w1 = (0xFF2FFFFF); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x280, ((Res87 *)D_80196AF8)->img + 0x1AE8, 0x60, 0x20, 9);
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 0x60) << 2)) > (0) ? ((s16)((x + 0x60) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 0x20) << 2)) > (0) ? ((s16)((y + 0x20) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << 2)) > (0) ? ((s16)(y << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((0) - (((s16)(x << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xD7000000); _g->w1 = (0x80008000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = (a | 0xFFFFFF00); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000C00); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001201); _g->w1 = (0); };
    if (a == 0xFF) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0xF0A7008); };
    } else {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x504240); };
    }
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xFC119623); _g->words.w1 = (0xFF2FFFFF); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
}
