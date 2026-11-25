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
    s32 m[4][4];
} Mtx1D4;
extern Mtx1D4 *D_801969B0;
void func_000228d0(Mtx1D4 *m, u16 *perspNorm, f32 fovy, f32 aspect, f32 near, f32 far, f32 scale);
void func_000210c0(Mtx1D4 *m, f32 xEye, f32 yEye, f32 zEye, f32 xAt, f32 yAt, f32 zAt, f32 xUp, f32 yUp, f32 zUp);
void guMtxIdent(Mtx1D4 *m);
void func_001D573C(void) {
    u16 perspNorm;
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xE7000000;
        _g->w1 = 0;
    }
    func_000228d0(D_801969B0, &perspNorm, 1.0f, 4.0f / 3.0f, 1.0f, 8000.0f, 1.0f);
    func_000210c0(D_801969B0 + 1, 0.0f, 2750.0f, 6759.0f, 0.0f, 16.3f, 0.0f, 0.0f, 1.0f, 0.0f);
    guMtxIdent(D_801969B0 + 2);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380007;
        _g->w1 = (u32)D_801969B0++;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380005;
        _g->w1 = (u32)D_801969B0++;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380003;
        _g->w1 = (u32)D_801969B0++;
    }
}
