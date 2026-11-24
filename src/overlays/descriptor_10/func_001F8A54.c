typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
extern f32 D_801D06FC;
extern f32 D_801D0700;
extern f32 D_801D0704;
extern f32 D_801D0710;
extern f32 D_801D0720;
extern f32 D_801D072C;
extern f32 D_801D0730;
extern f32 D_801D083C;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
typedef struct {
    s32 m[16];
} Mtx1F;
void guScale(Mtx1F *m, f32 x, f32 y, f32 z);
void func_000210c0(Mtx1F *m, f32 xEye, f32 yEye, f32 zEye, f32 xAt, f32 yAt, f32 zAt, f32 xUp, f32 yUp, f32 zUp);
void func_000228d0(Mtx1F *m, u16 *perspNorm, f32 fovy, f32 aspect, f32 near, f32 far, f32 scale);
extern Mtx1F *D_801969B0;
extern f32 D_801D06FC;
extern f32 D_801D0700;
extern f32 D_801D0704;
extern f32 D_801D0710;
extern f32 D_801D0720;
extern f32 D_801D072C;
extern f32 D_801D0730;
extern f32 D_801D083C;
void func_001F8A54(void) {
    u16 norm;
    Gfx *g;
    func_000228d0(D_801969B0, &norm, D_801D0710, 4.0f / 3.0f, 1.0f, 4000.0f, 1.0f);
    func_000210c0(D_801969B0 + 1, D_801D0720, D_801D072C, D_801D0704,
             D_801D0730, D_801D083C, D_801D0700, 0.0f, 1.0f, 0.0f);
    guScale(D_801969B0 + 2, D_801D06FC, D_801D06FC, D_801D06FC);
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xDB0E0000;
    g->w1 = norm;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xDA380007;
    g->w1 = (u32)D_801969B0++;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xDA380005;
    g->w1 = (u32)D_801969B0++;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xDA380003;
    g->w1 = (u32)D_801969B0++;
}
