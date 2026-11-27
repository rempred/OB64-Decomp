typedef signed int s32;
typedef float f32;
f32 func_0011A778(f32 t, f32 *x, f32 *y, f32 *m, s32 n) {
    s32 lo = 0;
    s32 hi = n - 1;
    s32 mid;
    f32 h;
    f32 a;
    f32 b;
    f32 d;
    while (lo < hi) {
        mid = (lo + hi) / 2;
        if (x[mid] < t) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    lo -= lo > 0;
    d = t - x[lo];
    b = m[lo + 1];
    a = m[lo];
    h = x[lo + 1] - x[lo];
    return (((b - a) * d / h + a * 3.0f) * d + ((y[lo + 1] - y[lo]) / h - (a + a + b) * h)) * d + y[lo];
}
