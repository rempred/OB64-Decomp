typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_80196AF8;
void func_00087dec(void *pal, void *img, u16 w, u16 h);
typedef union {
    struct {
        u32 w0;
        u32 w1;
    } words;
    long long force_align[1];
} GfxU87;
u8 D_8016DE1C(u8 cls, u8 base);
u8 D_8016DF18(u8 cls, u8 base);
extern u8 D_8018ECE4[][6];
extern Gfx D_06002470[];
extern Gfx D_060025E8[];
extern Gfx D_06002610[];
typedef struct {
    u8 pad0[0x14];
    u8 *icons;
    u8 pad18[0x20 - 0x18];
    u8 *big;
    u8 *small;
    u8 *smallAlt;
} ResBA9;
void func_00087dec(void *pal, void *img, u16 w, u16 h);
void func_000a7360(u8 c) {
    u8 pic = D_8016DF18(c, c);
    s32 mode;
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001201); _g->w1 = (0); };
    mode = (D_8016DE1C(c, c) == 2) ? 3 : 1;
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xFD100000); _g->words.w1 = ((u32)(((ResBA9 *)D_80196AF8)->icons + (mode << 12))); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xF5100000); _g->words.w1 = (0x7014060); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE6000000); _g->words.w1 = (0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xF3000000); _g->words.w1 = (0x77FF080); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xF5102000); _g->words.w1 = (0x14060); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xF2000000); _g->words.w1 = (0xFC07C); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xDE000000); _g->words.w1 = ((u32)D_06002470); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE3001001); _g->words.w1 = (0x8000); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE3001201); _g->words.w1 = (0); };
    if (mode == 3) {
        func_00087dec(((ResBA9 *)D_80196AF8)->big + 0x200, ((ResBA9 *)D_80196AF8)->big + 0x400 + pic * 0x380, 0x20, 0x1C);
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = ((u32)D_060025E8); };
    } else {
        u8 *t;
        if (D_8018ECE4[c][0] & 0x80) {
            t = ((ResBA9 *)D_80196AF8)->smallAlt;
        } else {
            t = ((ResBA9 *)D_80196AF8)->small;
        }
        func_00087dec(t + 0x200, t + 0x400 + pic * 0x180, 0x10, 0x18);
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = ((u32)D_06002610); };
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
}
