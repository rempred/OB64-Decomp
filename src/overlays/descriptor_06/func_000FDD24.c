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
void guMtxF2L(f32 mf[4][4], void *m);
void func_000fcd70(void *a, s32 b, s32 c);
void guTranslateF(f32 mf[4][4], f32 x, f32 y, f32 z);
typedef struct {
    u16 state;
    u8 unk02[2];
    f32 x;
    f32 y;
    void *model;
    s16 alpha;
} SpriteFA5;
void func_000FDD24(SpriteFA5 *o) {
    f32 mf[4][4];
    if (o->state != 0) {
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
            _g->w0 = 0xFCFF97FF;
            _g->w1 = 0xFF2CFE7F;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xFA000000;
            _g->w1 = (u8)o->alpha;
        }
        guTranslateF(mf, o->x, o->y, 0.0f);
        guMtxF2L(mf, D_800E9BE0->mtx[gCardMatrixCount]);
        gTitleCardDisplayListCursor->w0 = 0xDA380000;
        gTitleCardDisplayListCursor->w1 = (u32)D_800E9BE0->mtx[gCardMatrixCount];
        gCardMatrixCount++;
        gTitleCardDisplayListCursor++;
        func_000fcd70(o->model, 0, 0);
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xD8380002;
            _g->w1 = 0x40;
        }
    }
}
void guTranslateF(f32 mf[4][4], f32 x, f32 y, f32 z);
