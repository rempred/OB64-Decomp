void func_00181648(float matrix[4][4], int index);
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef signed long long s64;
typedef float f32;
typedef union {
    s32 m[4][4];
    s64 force_structure_alignment;
} Mtx;
void guMtxF2L(f32 mf[4][4], Mtx *m);
typedef struct {
    s32 data[0x16];
} Camera;
typedef struct {
    Camera *saved;
    s32 arg;
    s16 timer;
    s16 alpha;
    s16 *alphaPtr;
    s16 unk10;
    s32 unk14;
} Ovl17F9C0Ctx;
extern Ovl17F9C0Ctx *D_8021AF00;
void func_00181B54(void);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx181;
typedef struct {
    void *p0;
    void *p1;
    u8 (*mtx)[0x40];
} FbSet181;
typedef Gfx181 Gfx;
extern Gfx181 *gTitleCardDisplayListCursor;
extern FbSet181 *D_800E9BE0;
extern u16 gCardMatrixCount;
extern u8 D_8021ABE8[];
extern u8 D_8021AED4[];
extern u8 D_8021AE48[];
extern Gfx *D_8021DE98[];
void func_00181B54(void) {
    f32 mf[4][4];
    s16 i;
    s16 j;
    s16 n = 0;
    u8 k;
    s32 col;
    s32 row;
    u16 uls;
    u16 ult;
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_8021ABE8); };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFB) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(0xFF) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0xFF) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0xFF) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(D_8021AF00->alpha) & ((0x01 << (8)) - 1)) << (0))))); };
    for (i = 0; i < 41; i++) {
        func_00181648(mf, i);
        guMtxF2L(mf, (Mtx *)D_800E9BE0->mtx[gCardMatrixCount]);
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xDA380003;
            _g->w1 = (u32)D_800E9BE0->mtx[gCardMatrixCount++] - 0x80000000;
        }
        for (j = 0; j < D_8021AED4[i]; j++) {
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            k = D_8021AE48[n];
            col = k % 5;
            row = k / 5;
            uls = col * 64;
            ult = row * 32;
            { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((320) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(D_8021AF00->arg); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((((uls + 63) - (uls) + 1) * 2) + 7) >> 3)) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(6) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((uls) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((ult) << 2) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((uls + 63) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((ult + 31) << 2) & ((0x01 << (12)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((((uls + 63) - (uls) + 1) * 2) + 7) >> 3)) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(6) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((uls) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((ult) << 2) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((uls + 63) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((ult + 31) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(63 << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(31 << 2) & ((0x01 << (12)) - 1)) << (0))); };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_8021DE98[n++]); };
        }
    }
}
