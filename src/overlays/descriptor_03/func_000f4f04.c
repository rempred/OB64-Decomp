typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct {
    u8 unk000[0x5C];
    f32 fov;
    u8 unk060[0x10];
    f32 eye[3];
    f32 at[3];
    f32 up[3];
    u8 unk094[0x70];
    s32 w104;
    u8 unk108[4];
    f32 f10C;
    u8 unk110[0xC];
    void *sky;
    void *tex120;
    u8 unk124[0x2A];
    u8 r;
    u8 g;
    u8 b;
    u8 unk151[0xB];
    f32 f15C;
} Scene0E;
extern Gfx *gTitleCardDisplayListCursor;
extern Scene0E *D_801ABA58;
void *func_0000978C();
void func_000f4f04(void) {
    void *a = func_0000978C(0x02093576, 4, -4, 5);
    void *b = func_0000978C(0x02093576, 4, -4, 6);
    s32 t = D_801ABA58->w104;
    u8 s;
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(a); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xF3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((((((32) * (32) + 0) >> 0) - 1) < (2047) ? ((((32) * (32) + 0) >> 0) - 1) : (2047)))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((1 << 11) + ((1) > (((32) * (2) / 8)) ? (1) : (((32) * (2) / 8))) - 1) / ((1) > (((32) * (2) / 8)) ? (1) : (((32) * (2) / 8))))) & ((0x01 << (12)) - 1)) << (0)))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((32) * 2) + 7) >> 3) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((32) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(((32) - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
    { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(b); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0x100) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xF3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((((((32) * (32) + 0) >> 0) - 1) < (2047) ? ((((32) * (32) + 0) >> 0) - 1) : (2047)))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((1 << 11) + ((1) > (((32) * (2) / 8)) ? (1) : (((32) * (2) / 8))) - 1) / ((1) > (((32) * (2) / 8)) ? (1) : (((32) * (2) / 8))))) & ((0x01 << (12)) - 1)) << (0)))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((32) * 2) + 7) >> 3) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0x100) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(1) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(1) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((32) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(((32) - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE3001001;
        g->w1 = 0;
    }
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0x80) & ((0x01 << (8)) - 1)) << (0)))); };
    s = t >> 1;
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xF2000000 | (((0x80 - s) & 0x7F) << 12) | (s & 0x7F);
        g->w1 = 0;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xF2000000 | ((t & 0x7F) << 12) | (t & 0x7F);
        g->w1 = 0x01000000;
    }
}
