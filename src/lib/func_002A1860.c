typedef signed short s16;
typedef signed int s32;
typedef float f32;
typedef double f64;
extern f64 D_80239510[];
extern f64 D_80239568[];
void func_002A1860(f32 *t, f32 *v, f32 *out, s16 n);
void func_002A1860(f32 *x, f32 *y, f32 *z, s16 n) {
    s32 i;
    f64 t;
    z[0] = 0.0f;
    z[n - 1] = 0.0f;
    for (i = 0; i < n - 1; i++) {
        D_80239510[i] = x[i + 1] - x[i];
        D_80239568[(i + 1) - 1] = (y[i + 1] - y[i]) / D_80239510[i];
    }
    z[1] = D_80239568[(2) - 1] - D_80239568[(1) - 1] - D_80239510[0] * z[0];
    D_80239568[(1) - 1] = 2.0f * (x[2] - x[0]);
    for (i = 1; i < n - 2; i++) {
        t = D_80239510[i] / D_80239568[(i) - 1];
        z[i + 1] = D_80239568[(i + 2) - 1] - D_80239568[(i + 1) - 1] - z[i] * t;
        D_80239568[(i + 1) - 1] = 2.0f * (x[i + 2] - x[i]) - D_80239510[i] * t;
    }
    z[n - 2] -= D_80239510[n - 2] * z[n - 1];
    for (i = n - 2; i > 0; i--) {
        z[i] = (z[i] - D_80239510[i] * z[i + 1]) / D_80239568[(i) - 1];
    }
}
