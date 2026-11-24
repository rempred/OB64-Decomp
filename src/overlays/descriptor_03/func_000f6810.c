typedef signed int s32;
typedef float f32;
void D_8007FFD0(f32 *v);
f32 *D_8007FEE0(f32 *out, f32 *a, f32 *b);
void D_80080040(f32 *out, f32 *a, f32 *b);
void D_80080190(f32 *v, f32 s);
f32 *D_8007FF70(f32 *out, f32 *v);
f32 D_8009CE20(f32 x);
void D_800800C0(f32 *out, f32 *a, f32 *b);
void D_800801D0(f32 *a, f32 *b);
void D_80080150(f32 *a, f32 *b);
void D_8007FE50(f32 *dst, f32 *src);
typedef struct FrustumF63 {
    f32 eye[3];
    f32 dir[3];
    f32 corner[4][3];
    f32 plane[4][3];
    f32 min[3];
    f32 max[3];
} FrustumF63;
void func_000f6810(f32 fov, f32 aspect, f32 *eye, f32 *at, f32 *up, f32 far, FrustumF63 *f) {
    f32 h[3];
    f32 v[3];
    s32 i;
    s32 j;
    D_80080040(f->dir, at, eye);
    D_8007FFD0(f->dir);
    D_80080190(f->dir, far);
    D_8007FEE0(h, up, f->dir);
    D_8007FFD0(h);
    fov /= 360.0f;
    fov *= 3.1415927f;
    D_80080190(h, far * D_8009CE20(fov) * aspect);
    D_8007FF70(v, up);
    D_80080190(v, far * D_8009CE20(fov));
    D_800800C0(f->corner[0], f->dir, h);
    D_800801D0(f->corner[0], v);
    D_80080040(f->corner[1], f->dir, h);
    D_800801D0(f->corner[1], v);
    D_80080040(f->corner[2], f->dir, h);
    D_80080150(f->corner[2], v);
    D_800800C0(f->corner[3], f->dir, h);
    D_80080150(f->corner[3], v);
    D_8007FFD0(D_8007FEE0(f->plane[0], f->corner[0], f->corner[1]));
    D_8007FFD0(D_8007FEE0(f->plane[1], f->corner[1], f->corner[2]));
    D_8007FFD0(D_8007FEE0(f->plane[2], f->corner[2], f->corner[3]));
    D_8007FFD0(D_8007FEE0(f->plane[3], f->corner[3], f->corner[0]));
    D_8007FE50(f->eye, eye);
    D_800801D0(f->corner[0], f->eye);
    D_800801D0(f->corner[1], f->eye);
    D_800801D0(f->corner[2], f->eye);
    D_800801D0(f->corner[3], f->eye);
    D_800801D0(f->dir, f->eye);
    for (i = 0; i < 3; i++) {
        f->min[i] = f->max[i] = eye[i];
    }
    for (j = 0; j < 4; j++) {
        for (i = 0; i < 3; i++) {
            if (f->min[i] > f->corner[j][i]) {
                f->min[i] = f->corner[j][i];
            }
            if (f->max[i] < f->corner[j][i]) {
                f->max[i] = f->corner[j][i];
            }
        }
    }
}
void D_8007FE50(f32 *dst, f32 *src);
void D_80080040(f32 *out, f32 *a, f32 *b);
void D_8007FFD0(f32 *v);
f32 *D_8007FEE0(f32 *out, f32 *a, f32 *b);
void D_80080190(f32 *v, f32 s);
void D_800801D0(f32 *a, f32 *b);
void D_800800C0(f32 *out, f32 *a, f32 *b);
f32 D_8009CE20(f32 x);
