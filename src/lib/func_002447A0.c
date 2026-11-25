typedef signed int s32;
typedef float f32;
void *func_00001330(s32 size);
void *func_000016C4(void *ptr);
void func_002447A0(s32 n, f32 *d, f32 *v, f32 *c);
void func_002447A0(s32 n, f32 *x, f32 *y, f32 *z) {
    f32 *buf;
    f32 *h;
    f32 *d;
    f32 t;
    s32 i;
    if (n < 3) {
        for (;;) {
        }
    }
    buf = func_00001330(n * 8);
    if (buf == ((void *)0)) {
        for (;;) {
        }
    }
    h = buf;
    d = buf + n;
    z[0] = 0.0f;
    z[n - 1] = 0.0f;
    for (i = 0; i < n - 1; i++) {
        h[i] = x[i + 1] - x[i];
        d[i + 1] = (y[i + 1] - y[i]) / h[i];
    }
    z[1] = d[2] - d[1] - h[0] * z[0];
    d[1] = 2 * (x[2] - x[0]);
    for (i = 1; i < n - 2; i++) {
        t = h[i] / d[i];
        z[i + 1] = d[i + 2] - d[i + 1] - z[i] * t;
        d[i + 1] = 2 * (x[i + 2] - x[i]) - h[i] * t;
    }
    z[n - 2] -= h[n - 2] * z[n - 1];
    for (i = n - 2; i > 0; i--) {
        z[i] = (z[i] - h[i] * z[i + 1]) / d[i];
    }
    func_000016C4(buf);
}
