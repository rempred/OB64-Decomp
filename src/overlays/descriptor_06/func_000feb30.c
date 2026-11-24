typedef signed short s16;
typedef signed int s32;
typedef float f32;
extern inline f32 SplineFA5(f32 x, f32 *t, f32 *y, f32 *m, s16 n) {
    s32 lo = 0;
    s32 hi = n - 1;
    s32 mid;
    f32 d;
    f32 h;
    while (lo < hi) {
        mid = (lo + hi) / 2;
        if (t[mid] < x) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    lo -= lo > 0;
    d = x - t[lo];
    h = t[lo + 1] - t[lo];
    return ((((m[lo + 1] - m[lo]) * d) / h + m[lo] * 3.0f) * d +
            ((y[lo + 1] - y[lo]) / h - (2.0f * m[lo] + m[lo + 1]) * h)) * d + y[lo];
}
void func_000feb30(f32 x, f32 *outA, f32 *outB, f32 *t, f32 *yA, f32 *yB, f32 *mA, f32 *mB, s16 n) {
    *outA = SplineFA5(x, t, yA, mA, n);
    *outB = SplineFA5(x, t, yB, mB, n);
}
