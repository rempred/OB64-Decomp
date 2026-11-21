typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct {
    u8 unk000[0x104];
    s32 w104;
    u8 unk108[4];
    f32 f10C;
    u8 unk110[0xC];
    void *sky;
    u8 unk120[0x2E];
    u8 r;
    u8 g;
    u8 b;
    u8 unk151[0xB];
    f32 f15C;
} Scene0E;
extern Gfx *gTitleCardDisplayListCursor;
extern Scene0E *D_801ABA58;
typedef struct {
    s32 m[16];
} MtxE;
typedef struct {
    u8 unk0[8];
    MtxE *mtx;
} DynE;
extern u16 gCardMatrixCount;
extern u8 D_801ABAD8[];
void guMtxIdent(MtxE *m);
void func_000F1D54(DynE *d) {
    guMtxIdent(&d->mtx[gCardMatrixCount]);
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380003;
        _g->w1 = (u32)&d->mtx[gCardMatrixCount++] - 0x80000000;
    }
    { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(D_801ABA58->sky); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(6) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(15) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xF3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((((((32) * (64) + 0) >> 0) - 1) < (2047) ? ((((32) * (64) + 0) >> 0) - 1) : (2047)))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((1 << 11) + ((1) > (((32) * (2) / 8)) ? (1) : (((32) * (2) / 8))) - 1) / ((1) > (((32) * (2) / 8)) ? (1) : (((32) * (2) / 8))))) & ((0x01 << (12)) - 1)) << (0)))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((32) * 2) + 7) >> 3) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(6) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(15) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(14) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((32) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(((64) - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_801ABAD8); };
}
