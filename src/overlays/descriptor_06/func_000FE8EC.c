typedef signed short s16;
typedef signed int s32;
typedef float f32;
typedef double f64;
extern f64 D_801B4CA0[];
extern f64 D_801B4CF8[];
void func_000FE8EC(f32 *x, f32 *y, f32 *z, s16 n) {
    s32 i;
    f64 t;
    z[0] = 0.0f;
    z[n - 1] = 0.0f;
    for (i = 0; i < n - 1; i++) {
        D_801B4CA0[i] = x[i + 1] - x[i];
        D_801B4CF8[(i + 1) - 1] = (y[i + 1] - y[i]) / D_801B4CA0[i];
    }
    z[1] = D_801B4CF8[(2) - 1] - D_801B4CF8[(1) - 1] - D_801B4CA0[0] * z[0];
    D_801B4CF8[(1) - 1] = 2.0f * (x[2] - x[0]);
    for (i = 1; i < n - 2; i++) {
        t = D_801B4CA0[i] / D_801B4CF8[(i) - 1];
        z[i + 1] = D_801B4CF8[(i + 2) - 1] - D_801B4CF8[(i + 1) - 1] - z[i] * t;
        D_801B4CF8[(i + 1) - 1] = 2.0f * (x[i + 2] - x[i]) - D_801B4CA0[i] * t;
    }
    z[n - 2] -= D_801B4CA0[n - 2] * z[n - 1];
    for (i = n - 2; i > 0; i--) {
        z[i] = (z[i] - D_801B4CA0[i] * z[i + 1]) / D_801B4CF8[(i) - 1];
    }
}
