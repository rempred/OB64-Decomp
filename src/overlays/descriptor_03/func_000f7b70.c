typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
void D_8007FFD0(f32 *v);
f32 *D_8007FEE0(f32 *out, f32 *a, f32 *b);
void D_80080040(f32 *out, f32 *a, f32 *b);
void D_80080190(f32 *v, f32 s);
f32 D_8009CE20(f32 x);
void D_800800C0(f32 *out, f32 *a, f32 *b);
void D_800801D0(f32 *a, f32 *b);
void D_8007FE50(f32 *dst, f32 *src);
void D_8007FE50(f32 *dst, f32 *src);
void D_80080040(f32 *out, f32 *a, f32 *b);
void D_8007FFD0(f32 *v);
f32 *D_8007FEE0(f32 *out, f32 *a, f32 *b);
void D_80080190(f32 *v, f32 s);
void D_800801D0(f32 *a, f32 *b);
void D_800800C0(f32 *out, f32 *a, f32 *b);
f32 *D_80080020(f32 *v, f32 x, f32 y, f32 z);
f32 D_8009CE20(f32 x);
#include "game/camera_f63_view.h"
extern inline void func_000f7480(CamF63 *c, f32 x, f32 y, f32 w, f32 h, f32 *dir) {
    f32 fwd[3];
    f32 up[3];
    f32 right[3];
    D_80080040(fwd, c->at, c->eye);
    D_8007FFD0(fwd);
    D_8007FEE0(right, fwd, c->up);
    D_8007FFD0(right);
    D_8007FEE0(up, fwd, right);
    D_8007FFD0(up);
    D_80080190(fwd, 1.0f / D_8009CE20(c->fov * 0.5f / 360.0f * 6.2831855f));
    D_80080190(up, 2.0f * (y / h - 0.5f));
    D_80080190(right, 2.0f * ((x / w - 0.5f) * w / h));
    D_800801D0(fwd, up);
    D_800800C0(dir, fwd, right);
    D_8007FFD0(dir);
}
s32 func_000f7b70(CamF63 *c, f32 x, f32 y, f32 *out);
s32 func_000f7b70(CamF63 *c, f32 x, f32 y, f32 *out) {
    f32 dir[3];
    f32 t;
    if (c->eye[1] == 0.0f) {
        D_8007FE50(out, c->eye);
        return 1;
    }
    func_000f7480(c, x, y, 320.0f, 240.0f, dir);
    if (!(c->eye[1] * dir[1] >= 0.0f)) {
        t = -c->eye[1] / dir[1];
        D_80080020(out, c->eye[0] + t * dir[0], 0.0f, c->eye[2] + t * dir[2]);
        return 1;
    }
    return 0;
}
