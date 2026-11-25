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
extern u8 D_801B8388[];
s32 func_001CE114(s32 a, s32 w, s32 h);
void func_001CF3AC(u8 *img, s16 x, s16 y);
typedef struct {
    u8 b[4];
    u16 w;
    u16 h;
} ImgHdr1D47;
typedef struct {
    u8 *img;
    s16 vis;
    u8 pad6[4];
    s16 x;
    s16 y;
} Spr1D47;
void func_001D7650(Spr1D47 *s) {
    if (s->vis == 0) {
        return;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor;
        g->w0 = 0xDE000000;
        g->w1 = (u32)D_801B8388;
        gTitleCardDisplayListCursor = g + 1;
    }
    if (s->img[3] == 0) {
        { Gfx *_p = gTitleCardDisplayListCursor++; _p->w0 = 0xFD100000; _p->w1 = (u32)((s)->img + (func_001CE114(0, ((ImgHdr1D47 *)(s)->img)->w, ((ImgHdr1D47 *)(s)->img)->h) + 8)); { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE8000000; _g->w1 = 0; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xF5000100; _g->w1 = 0x7000000; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE6000000; _g->w1 = 0; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xF0000000; _g->w1 = 0x703C000; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE7000000; _g->w1 = 0; } };
    } else {
        { Gfx *_p = gTitleCardDisplayListCursor++; _p->w0 = 0xFD100000; _p->w1 = (u32)((s)->img + (func_001CE114(1, ((ImgHdr1D47 *)(s)->img)->w, ((ImgHdr1D47 *)(s)->img)->h) + 8)); { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE8000000; _g->w1 = 0; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xF5000100; _g->w1 = 0x7000000; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE6000000; _g->w1 = 0; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xF0000000; _g->w1 = 0x73FC000; } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = 0xE7000000; _g->w1 = 0; } };
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xFA000000;
        _g->w1 = ((u8 *)&s->vis)[1] | ~0xFF;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor;
        g->w0 = 0xFB000000;
        g->w1 = 1;
        gTitleCardDisplayListCursor = g + 1;
    }
    func_001CF3AC(s->img, s->x, s->y);
}
