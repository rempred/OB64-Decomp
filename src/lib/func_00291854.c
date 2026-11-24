typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
typedef struct {
    u8 unk00[0x18];
    s16 alpha;
    u8 unk1A[0x16];
    s32 x;
    s32 y;
    s32 w;
    u8 unk3C[0x94];
    u8 *text;
} Win28;
void D_8017D6D0(Win28 *w, u8 a, u8 b, u8 c, s32 d, s32 e, s32 f);
void func_00291854(Win28 *w) {
    u8 *t = w->text;
    if (w->alpha != 0) {
        u8 last = t[0x5F5] - 1;
        s32 y = w->y - 4;
        s32 x = w->x + 4;
        s32 width = w->w - 12;
        u8 first = t[0x5F4];
        u8 a = t[0x5F1];
        if (first < last) {
            Gfx *g = gTitleCardDisplayListCursor++;
            g->w0 = 0xFA000000;
            g->w1 = ((u8 *)w)[0x19] | 0xFFFFFF00;
            D_8017D6D0(w, a, first, last, y, x, width);
        }
    }
}
