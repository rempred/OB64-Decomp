typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern void *D_80218D84;
extern void *D_8021CA70;
void func_00177F00();
typedef union {
    struct {
        u32 w0;
        u32 w1;
    } words;
    long long force_align[1];
} Gfx177;
extern Gfx177 *gTitleCardDisplayListCursor;
typedef struct {
    u8 pad0[0x18];
    s16 alpha[5];
    s8 id;
    u8 pad23[0x2C - 0x23];
    s32 x;
    s32 y;
} Win177;
extern u8 D_80193BC0_copy[][0x38];
extern signed char D_8021C9B0[];
extern signed char *D_801ED410;
void D_8017C4B4(u32);
void D_80200DD0(void *, s32 y, s32 k);
void D_80203558(s32 x0, s32 y0, s32 x1, s32 y1);
void D_80179034(signed char *s, s32 x, s32 y);
s32 func_000238B0(signed char *buf, const signed char *fmt, ...);
void bzero(void *p, s32 n);
void func_00177F00(Win177 *w, s32 k) {
    s32 x;
    s32 y;
    signed char buf[0x80];
    if (w->alpha[k] == 0) {
        return;
    }
    x = w->x;
    y = w->y;
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    D_8017C4B4(w->alpha[k]);
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE3001001); _g->words.w1 = (0x8000); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xFD100000); _g->words.w1 = ((u32)D_8021CA70); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE8000000); _g->words.w1 = (0); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF5000100); _g->words.w1 = (0x7000000); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE6000000); _g->words.w1 = (0); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF0000000); _g->words.w1 = (0x73FC000); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xD7000002); _g->words.w1 = (0x80008000); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xFD500000); _g->words.w1 = ((u32)D_80218D84); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF5500000); _g->words.w1 = (0x7000000); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE6000000); _g->words.w1 = (0); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF3000000); _g->words.w1 = (0x73BF19A); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF5480A00); _g->words.w1 = (0); };
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xF2000000); _g->words.w1 = (0x9C0BC); };
    D_80200DD0(x + 6, y + 6, 0x1C);
    D_80203558(x + 6, y + 6, x + 0x2E, y + 0x36);
    { Gfx177 *_g = gTitleCardDisplayListCursor++; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    bzero(buf, 0x15);
    func_000238B0(buf, D_8021C9B0, D_80193BC0_copy[w->id]);
    D_80179034(buf, x + 0x34, y + 0xE);
    D_80179034(D_801ED410, x + 0x3E, y + 0x20);
}
