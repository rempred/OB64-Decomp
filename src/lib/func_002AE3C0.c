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
} Mtx2AEb;
extern Mtx2AEb *D_801969B0;
void func_000228d0(Mtx2AEb *m, u16 *perspNorm, f32 fovy, f32 aspect, f32 near, f32 far, f32 scale);
void func_000210c0(Mtx2AEb *m, f32 xEye, f32 yEye, f32 zEye, f32 xAt, f32 yAt, f32 zAt, f32 xUp, f32 yUp, f32 zUp);
typedef struct {
    f32 fovy;
    f32 aspect;
    f32 near;
    f32 far;
    f32 scale;
    f32 eye[3];
    f32 at[3];
    f32 up[3];
} View2AE;
void func_002AE3C0(View2AE *c) {
    u16 perspNorm;
    func_000228d0(D_801969B0, &perspNorm, c->fovy, c->aspect, c->near, c->far, c->scale);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDB0E0000;
        _g->w1 = perspNorm;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380007;
        _g->w1 = (u32)D_801969B0++;
    }
    func_000210c0(D_801969B0, c->eye[0], c->eye[1], c->eye[2], c->at[0], c->at[1], c->at[2], c->up[0], c->up[1], c->up[2]);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380005;
        _g->w1 = (u32)D_801969B0++;
    }
}
