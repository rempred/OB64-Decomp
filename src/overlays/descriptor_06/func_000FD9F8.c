typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
typedef struct {
    void *p0;
    void *p1;
    u8 (*mtx)[0x40];
} FbSetFA5;
extern FbSetFA5 *D_800E9BE0;
extern u16 gCardMatrixCount;
void func_00028F60(f32 mf[4][4], f32 x, f32 y, f32 z);
void guMtxF2L(f32 mf[4][4], void *m);
void func_000fcd70(void *a, s32 b, s32 c);
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
void func_000FD9F8(TweenFA5 *tw) {
    f32 mf[4][4];
    switch (tw->state) {
        case 0:
        case 0xFFFD:
        case 0xFFFE:
        case 0xFFFF:
            return;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xE7000000;
        _g->w1 = 0;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xE200001C;
        _g->w1 = 0x4041C8;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xFC119623;
        _g->w1 = 0xFF2FFFFF;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xFA000000;
        _g->w1 = ((u8)tw->cur[0] << 24) | ((u8)tw->cur[1] << 16) | ((u8)tw->cur[2] << 8) | (u8)tw->cur[3];
    }
    func_00028F60(mf, (*(f32 *)((u8 *)(tw) + (0x10))), (*(f32 *)((u8 *)(tw) + (0x14))), 1.0f);
    mf[3][0] = (*(f32 *)((u8 *)(tw) + (8)));
    mf[3][1] = (*(f32 *)((u8 *)(tw) + (0xC)));
    mf[3][2] = 0.0f;
    guMtxF2L(mf, D_800E9BE0->mtx[gCardMatrixCount]);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380000;
        _g->w1 = (u32)D_800E9BE0->mtx[gCardMatrixCount++];
    }
    switch (tw->state) {
        case 1:
            func_000fcd70((*(void * *)((u8 *)(tw) + (4))), 0, 0);
            break;
        case 2:
            func_000FD77C((*(void * *)((u8 *)(tw) + (4))), (*(void * *)((u8 *)(tw) + (0x38 + (*(s32 *)((u8 *)(tw) + (0x34))) * 4))),
                                     (*(s32 *)((u8 *)(tw) + (0x40))), (*(s32 *)((u8 *)(tw) + (0x44))), (*(s32 *)((u8 *)(tw) + (0x48))));
            func_000fcd70((*(void * *)((u8 *)(tw) + (0x38 + (*(s32 *)((u8 *)(tw) + (0x34))) * 4))), 0, 0);
            (*(s32 *)((u8 *)(tw) + (0x34))) ^= 1;
            break;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xD8380002;
        _g->w1 = 0x40;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xE7000000;
        _g->w1 = 0;
    }
}
