typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk0[4];
    u16 w;
    u16 h;
} Size1F;
void bzero(void *p, s32 n);
void func_001FA714(u8 *img, s16 x, s16 y, s16 s, void *b, void *m, void *a);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
u32 func_00201E38(s32 fmt, u32 w);
u32 func_00201E9C(s32 fmt, u32 w);
extern inline void func_001F9170(u16 *p, s16 a, s16 b, s16 c, s16 d) {
    bzero(p, 0x10);
    p[0] = a;
    p[1] = b;
    p[4] = c << 6;
    p[5] = d << 6;
    ((u8 *)p)[0xF] = 0xFF;
}
void func_001FA714(u8 *img, s16 x, s16 y, s16 s, void *b, void *m, void *a) {
    typedef struct { u16 h[8]; } V16;
    Size1F *hdr = (Size1F *)img;
    Gfx *gfx;
    V16 *vtx;
    s32 bpr;
    u8 *timg;
    s32 rows;
    V16 *start;
    void *mtx;
    s32 h;
    s32 w;
    s32 xr;
    s32 x0;
    s32 ny;
    s32 row;
    s32 n;
    gfx = *(Gfx **)b;
    vtx = *(V16 **)a;
    mtx = *(void **)m;
    bpr = func_00201E38(s, hdr->w);
    h = hdr->h;
    timg = (u8 *)hdr + 8;
    start = vtx;
    w = hdr->w;
    rows = 0x1000 / bpr;
    row = 0;
    x0 = x;
    ny = -y;
    xr = w + x0;
    for (; h > 0; h -= rows, row += rows) {
        func_001F9170((u16 *)vtx++, x0, ny - row, 0, row);
        func_001F9170((u16 *)vtx++, xr, ny - row, w, row);
        if (rows >= h) {
            row += h;
            func_001F9170((u16 *)vtx++, x0, ny - row, 0, row);
            func_001F9170((u16 *)vtx++, xr, ny - row, w, row);
            break;
        }
    }
    h = hdr->h;
    row = 0;
    while (start + 2 < vtx) {
        n = rows;
        if (h < rows) {
            n = h;
        }
        if (s == 3) {
            { { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(3) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((func_00201E9C(3, w)) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(timg); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(3) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((((func_00201E9C(3, w) - 1) - (0) + 1) * 2) + 7) >> 3)) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((0) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row) << 2) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((func_00201E9C(3, w) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row + n - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(3) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((((func_00201E9C(3, w) - 1) - (0) + 1) * 2) + 7) >> 3)) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((0) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row) << 2) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((func_00201E9C(3, w) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row + n - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
        } else {
            { { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((func_00201E9C(2, w)) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(timg); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((((func_00201E9C(2, w) - 1) - (0) + 1) * 2) + 7) >> 3)) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((0) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row) << 2) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((func_00201E9C(2, w) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row + n - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((((func_00201E9C(2, w) - 1) - (0) + 1) * 2) + 7) >> 3)) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((0) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row) << 2) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((func_00201E9C(2, w) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row + n - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
        }
        { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0x01) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((4)) & ((0x01 << (8)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((0) + (4)) & ((0x01 << (7)) - 1)) << (1))); _g->w1 = (unsigned int)(start); };
        { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0x06) & ((0x01 << (8)) - 1)) << (24))) | (((unsigned int)(((unsigned int)((0) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((2) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((3) * 2) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)((0) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((3) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((1) * 2) & ((0x01 << (8)) - 1)) << (0)))); };
        row += n;
        start += 2;
        h -= n;
    }
    *(Gfx **)b = gfx;
    *(void **)m = mtx;
    *(V16 **)a = vtx;
}
u32 func_00201E38(s32 fmt, u32 w);
u32 func_00201E9C(s32 fmt, u32 w);
