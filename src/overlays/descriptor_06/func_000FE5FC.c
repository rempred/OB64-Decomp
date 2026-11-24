typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    s16 h0;
    u8 unk02[2];
    s32 w4;
    u8 unk08[4];
    s32 wC;
    u8 unk10[0x74];
    s32 x84;
    u8 x88;
    u8 x89;
    u8 x8A;
    u8 x8B;
} Widget3390;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_801869C8[];
void func_000FE5FC(Widget3390 *w);
typedef struct {
    void *p0;
    void *p1;
    u8 (*mtx)[0x40];
} FbSetFA5;
extern FbSetFA5 *D_800E9BE0;
extern u16 gCardMatrixCount;
typedef struct {
    u16 state;
    u8 unk02[6];
    f32 x;
    f32 y;
    f32 z;
    f32 scale;
    s16 alpha;
} CursorFA5;
void func_000fd300(CursorFA5 *o);
typedef struct {
    u16 state;
    u8 unk02[0x16];
    s16 t;
    s16 n;
    s16 cur[4];
    s16 from[4];
    s16 to[4];
    u8 unk34[4];
    void *bufA;
    void *bufB;
} TweenFA5;
void func_000FD9F8(TweenFA5 *tw);
typedef struct {
    u16 state;
    u8 unk02[2];
    f32 x;
    f32 y;
    void *model;
    s16 alpha;
} SpriteFA5;
void func_000FDD24(SpriteFA5 *o);
typedef struct {
    u16 state;
    u8 unk02[2];
    f32 x;
    f32 y;
    u8 unk0C;
    u8 alpha;
    u8 unk0E[8];
    s16 timer;
    u16 frame;
} SparkFA5;
void func_000FE370(SparkFA5 *o);
typedef struct { s32 m[16]; } MtxFA5;
void func_000ffdfc(u8 *m, Gfx **pg, MtxFA5 **pmtx, s32 k);
void func_000225d0(void *m, f32 l, f32 r, f32 b, f32 t, f32 n, f32 f, f32 scale);
extern u8 D_801B4828[];
void func_000FE5FC(Widget3390 *w) {
    u8 *p = (u8 *)w;
    MtxFA5 *mp;
    u32 k;
    u32 i;
    if ((*(s32 *)((u8 *)(p) + (0x194))) == 0) {
        return;
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = ((u32)D_801869C8); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xED000048); _g->w1 = (0x004FC308); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    func_000225d0(D_800E9BE0->mtx[gCardMatrixCount], -160.0f, 160.0f, -120.0f, 120.0f, -1000.0f, 1000.0f, 1.0f);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380007;
        _g->w1 = (u32)D_800E9BE0->mtx[gCardMatrixCount];
        gCardMatrixCount++;
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = ((u32)D_801B4828); };
    func_000fd300((CursorFA5 *)(p + 0x1E4));
    mp = (MtxFA5 *)D_800E9BE0->mtx[gCardMatrixCount];
    for (k = 0; k < 3; k++) {
        if ((*(u8 * *)((u8 *)(p) + (0x524 + k * 4))) != ((void *)0)) {
            func_000ffdfc((*(u8 * *)((u8 *)(p) + (0x524 + k * 4))), &gTitleCardDisplayListCursor, &mp, (*(s32 *)((u8 *)(p) + (0x198))));
        }
    }
    (*(s32 *)((u8 *)(p) + (0x198))) ^= 1;
    gCardMatrixCount += mp - (MtxFA5 *)D_800E9BE0->mtx[gCardMatrixCount];
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = ((u32)D_801B4828); };
    for (i = 0; i < 5; i++) {
        func_000FD9F8((TweenFA5 *)(p + 0x258 + i * 0x4C));
    }
    for (i = 0; i < 4; i++) {
        func_000FDD24((SpriteFA5 *)(p + 0x3D4 + i * 0x1C));
    }
    for (i = 0; i < 4; i++) {
        func_000FDFA0(p + 0x444 + i * 0x1C);
    }
    for (i = 0; i < 4; i++) {
        func_000FE370((SparkFA5 *)(p + 0x4B4 + i * 0x1C));
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
}
