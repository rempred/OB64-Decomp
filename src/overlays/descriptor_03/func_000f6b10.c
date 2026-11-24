typedef signed int s32;
typedef float f32;
void func_000f6b10(void *camera, f32 *point, f32 *x, f32 *y);
void D_8007FFD0(f32 *v);
f32 *D_8007FEE0(f32 *out, f32 *a, f32 *b);
extern inline f32 AbsF63(f32 v) {
    return v < 0.0f ? -v : v;
}
f32 *D_80080080(f32 *out, f32 *a, f32 s);
f32 sinf(f32 x);
f32 func_00020bf0(f32 x);
void func_000f6b10(void *camera, f32 *point, f32 *x, f32 *y) {
    f32 *c = camera;
    f32 *p = point;
    f32 perp[3];
    f32 up[3];
    f32 right[3];
    f32 fwd[3];
    f32 rel[3];
    f32 proj[3];
    f32 t;
    rel[0] = p[0] - c[5];
    rel[1] = p[1] - c[6];
    rel[2] = p[2] - c[7];
    fwd[0] = c[8] - c[5];
    fwd[1] = c[9] - c[6];
    fwd[2] = c[10] - c[7];
    D_8007FFD0(fwd);
    D_8007FEE0(right, c + 11, fwd);
    D_8007FEE0(up, fwd, right);
    D_8007FFD0(up);
    D_8007FFD0(right);
    D_80080080(proj, fwd, fwd[0] * rel[0] + fwd[1] * rel[1] + fwd[2] * rel[2]);
    perp[0] = rel[0] - proj[0];
    perp[1] = rel[1] - proj[1];
    perp[2] = rel[2] - proj[2];
    t = sinf(c[0] / 2.0f / 360.0f * 6.2831855f) / func_00020bf0(c[0] / 2.0f / 360.0f * 6.2831855f) *
        (fwd[0] * rel[0] + fwd[1] * rel[1] + fwd[2] * rel[2]);
    t = AbsF63(t);
    *x = 160.0f - (perp[0] * right[0] + perp[1] * right[1] + perp[2] * right[2]) * 120.0f / t;
    *y = 120.0f - (perp[0] * up[0] + perp[1] * up[1] + perp[2] * up[2]) * 120.0f / t;
}
void D_8007FFD0(f32 *v);
f32 *D_8007FEE0(f32 *out, f32 *a, f32 *b);
