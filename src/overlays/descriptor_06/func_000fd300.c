typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
extern u8 *D_801B3E20;
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
    u8 unk02[6];
    f32 x;
    f32 y;
    f32 z;
    f32 scale;
    s16 alpha;
} CursorFA5;
void func_000fd300(CursorFA5 *o) {
    f32 mf[4][4];
    if (o->state != 0) {
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE7000000;
            _g->w1 = 0;
        }
        if (o->alpha == 0xFF) {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE200001C;
            _g->w1 = 0x0F0A4000;
        } else {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE200001C;
            _g->w1 = 0x504340;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xFCFFFFFF;
            _g->w1 = 0xFFFCF67B;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xFA000000;
            _g->w1 = (u8)o->alpha;
        }
        func_00028F60(mf, o->scale, o->scale, o->scale);
        mf[3][0] = o->x;
        mf[3][1] = o->y;
        mf[3][2] = o->z;
        guMtxF2L(mf, D_800E9BE0->mtx[gCardMatrixCount]);
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xDA380003;
            _g->w1 = (u32)D_800E9BE0->mtx[gCardMatrixCount];
            gCardMatrixCount++;
        }
        func_000fcd70(((void **)D_801B3E20)[0x67], 0, 0);
    }
}
