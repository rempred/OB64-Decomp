typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void bzero(void *p, s32 n);
void func_001FA240(void *a, void *b, u8 *img);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
u32 func_00201E38(s32 fmt, u32 w);
u32 func_00201E9C(s32 fmt, u32 w);
static __inline__ void set_vertex_halfwords(u16 *p, s16 a, s16 b, s16 c, s16 d) {
    bzero(p, 0x10);
    p[0] = a;
    p[1] = b;
    p[4] = c << 6;
    p[5] = d << 6;
    ((u8 *)p)[0xF] = 0xFF;
}
typedef struct Part1F8 {
    u16 x;
    u16 y;
    u16 w;
    u16 h;
    u8 unk08[4];
    struct Part1F8 *next;
    u8 data[1];
} Part1F8;
void func_001FA240(void *a, void *b, u8 *img) {
    typedef struct { u16 h[8]; } V16;
    V16 *vtx = *(V16 **)a;
    Gfx *gfx = *(Gfx **)b;
    Part1F8 *part = (Part1F8 *)(img + 8);
    s32 i;
    u8 *timg;
    s32 rows;
    V16 *start;
    s32 h;
    s32 x;
    s32 xr;
    s32 w;
    s32 row;
    s32 n;
    for (i = 0; i < img[3]; part = part->next, i++) {
        Part1F8 *p = part;
        rows = 0x1000 / (s32)func_00201E38(2, p->w); /* a signed divide in retail */
        start = vtx;
        h = p->h;
        rows--;
        timg = p->data;
        w = p->w;
        x = p->x;
        row = 0;
        xr = x + w;
        while (h > 0) {
            set_vertex_halfwords((u16 *)vtx++, x, -(p->y + row), 0, row);
            set_vertex_halfwords((u16 *)vtx++, xr, -(p->y + row), w, row);
            if (rows >= h) {
                row += h;
                set_vertex_halfwords((u16 *)vtx++, x, -(p->y + row), 0, row);
                    set_vertex_halfwords((u16 *)vtx++, xr, -(p->y + row), w, row);
                    break;
            }
            set_vertex_halfwords((u16 *)vtx++, x, -(p->y + row + rows + 1), 0, row + rows + 1);
            set_vertex_halfwords((u16 *)vtx++, xr, -(p->y + row + rows + 1), w, row + rows + 1);
            h -= rows;
            row += rows;
        }
        h = p->h;
        row = 0;
        while (start < vtx) {
            n = rows;
            if (h < rows) {
                n = h - 1;
            }
            { { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((func_00201E9C(2, p->w)) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(timg); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((((func_00201E9C(2, p->w) - 1) - (0) + 1) * 2) + 7) >> 3)) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((0) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row) << 2) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((func_00201E9C(2, p->w) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row + n) << 2) & ((0x01 << (12)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((((func_00201E9C(2, p->w) - 1) - (0) + 1) * 2) + 7) >> 3)) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((0) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row) << 2) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((func_00201E9C(2, p->w) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((row + n) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
            row += n;
            { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0x01) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((4)) & ((0x01 << (8)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((0) + (4)) & ((0x01 << (7)) - 1)) << (1))); _g->w1 = (unsigned int)(start); };
            { Gfx *_g = (Gfx *)(gfx++); _g->w0 = ((unsigned int)(((unsigned int)(0x06) & ((0x01 << (8)) - 1)) << (24))) | (((unsigned int)(((unsigned int)((0) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((2) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((3) * 2) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)((0) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((3) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((1) * 2) & ((0x01 << (8)) - 1)) << (0)))); };
            h -= n;
            start += 4;
        }
    }
    *(V16 **)a = vtx;
    *(Gfx **)b = gfx;
}
u32 func_00201E38(s32 fmt, u32 w);
u32 func_00201E9C(s32 fmt, u32 w);
