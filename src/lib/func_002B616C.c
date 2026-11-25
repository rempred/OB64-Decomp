typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_8022A974;
void func_002B5D8C(s32 a, s32 b, s32 c, s32 d, s32 e);
extern u8 D_8022A9F0[];
typedef struct {
    s16 v[8];
} Vtx2B5;
extern Vtx2B5 *D_80197178;
extern u8 D_8022AB48[];
void D_8022DC38(Vtx2B5 *v, s16, s16, s32 z);
void func_002B5D8C(s32 a0, s32 a1, s32 cx, s32 cy, s32 col);
typedef struct {
    s32 t;
    s32 n;
    s16 x0;
    s16 y0;
    s16 x1;
    s16 y1;
    s16 pad10;
    s16 z;
    u8 pad14;
    u8 layer;
} Fade2B5;
void func_002B616C(s32 k) {
    Fade2B5 *f = (*(Fade2B5 * *)((u8 *)(D_8022A974) + (0x1A44)));
    s32 t;
    s32 n;
    if (f == ((void *)0) || k != f->layer) {
        return;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor;
        g->w0 = 0xDE000000;
        g->w1 = (u32)D_8022AB48;
        t = f->t;
        n = f->n;
        gTitleCardDisplayListCursor = g + 1;
    }
    if (t < n) {
        func_002B5D8C(f->x0 * (n - t) / n, f->y0 * (n - t) / n,
                                 f->x1 * t / n, f->y1 * t / n, f->z);
    } else {
        Vtx2B5 *v = D_80197178;
        D_8022DC38(D_80197178++, -0x140, -0xF0, f->z);
        D_8022DC38(D_80197178++, -0x140, 0xF0, f->z);
        D_8022DC38(D_80197178++, 0x140, 0xF0, f->z);
        D_8022DC38(D_80197178++, 0x140, -0xF0, f->z);
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0x01) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((4)) & ((0x01 << (8)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((0) + (4)) & ((0x01 << (7)) - 1)) << (1))); _g->w1 = (unsigned int)(v); };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0x06) & ((0x01 << (8)) - 1)) << (24))) | (((unsigned int)(((unsigned int)((0) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((3) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((1) * 2) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)((3) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((2) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((1) * 2) & ((0x01 << (8)) - 1)) << (0)))); };
    }
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_8022A9F0); };
}
