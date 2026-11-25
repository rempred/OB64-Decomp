typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef union {
    struct {
        u32 w0;
        u32 w1;
    } words;
    long long force_align[1];
} Gfx165;
extern Gfx165 *gTitleCardDisplayListCursor;
extern u8 D_80213648[];
extern u8 D_8018F480;
extern u8 D_8021EB50[];
void D_8017C4B4(u32);
void D_80176C6C(s32 x0, s32 y0, s32 x1, s32 y1, s32 s, s32 t, s32 tile);
u8 *D_80197E60(s32 a, s32 b, s32 c);
void D_80179034(signed char *s, s32 x, s32 y);
typedef struct {
    signed char name[0x600];
    s32 flags;
} Rec165;
typedef struct {
    u8 pad0[0x18];
    s16 alpha[10];
    s32 x;
    s32 y;
    u8 pad34[0xD0 - 0x34];
    Rec165 *rec;
} Win165;
void func_001677A8(Win165 *w, s32 k) {
    s32 x;
    s32 y;
    Rec165 *d;
    s32 f;
    s32 s;
    if (w->alpha[k] == 0) {
        return;
    }
    x = w->x;
    y = w->y;
    d = w->rec;
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    D_8017C4B4(w->alpha[k]);
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xDE000000); _g->words.w1 = ((u32)D_80213648); };
    D_8018F480 = 0;
    f = d->flags & 0xF0;
    if (f == 0) {
        s = 0;
    } else if (f == 0x10) {
        s = 12;
    } else {
        s = (f == 0x20) ? 24 : 0;
    }
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE3001001); _g->words.w1 = (0); };
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xFD100000); _g->words.w1 = ((u32)D_8021EB50); };
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF5100000); _g->words.w1 = (0x7000000); };
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE6000000); _g->words.w1 = (0); };
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF3000000); _g->words.w1 = (0x70FF200); };
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF5100800); _g->words.w1 = (0); };
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF2000000); _g->words.w1 = (0x3C03C); };
    D_80176C6C(x + 1, y + 1, x + 16, y + 16, 0, 0, 0);
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE3001001); _g->words.w1 = (0x8000); };
    D_80197E60(0x218E9B4, 4, 1);
    D_80176C6C(x + 4, y + 4, x + 15, y + 15, s, 0, 0);
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    f = d->flags & 0xF;
    if (f == 0) {
        s = 0;
    } else if (f == 1) {
        s = 7;
    } else {
        s = (f == 2) ? 14 : 0;
    }
    D_80197E60(0x218E9B4, 0, 0x23);
    D_80176C6C(x + 9, y + 1, x + 16, y + 8, 0, s, 0);
    { Gfx165 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    D_80179034(d->name, x + 0x14, y + 1);
}
