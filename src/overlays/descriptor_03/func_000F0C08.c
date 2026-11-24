#include "common/matrix_float.h"
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
typedef struct {
    u8 unk000[0x5C];
    f32 fov;
    u8 unk060[0x10];
    f32 eye[3];
    f32 at[3];
    f32 up[3];
    u8 unk094[0x70];
    s32 w104;
    u8 unk108[4];
    f32 f10C;
    u8 unk110[0xC];
    void *sky;
    void *tex120;
    u8 unk124[0x2A];
    u8 r;
    u8 g;
    u8 b;
    u8 unk151[0xB];
    f32 f15C;
} Scene0E;
extern Scene0E *D_801ABA58;
f32 *D_8007FEE0(f32 *out, f32 *a, f32 *b);
typedef struct {
    f32 t;
    f32 v;
    f32 out;
    f32 in;
    s16 interp;
} CurveKey;
typedef struct {
    CurveKey *keys;
    s16 n;
    s16 slopeMode;
    s16 pre;
    s16 post;
} Curve;
f32 func_000F4AFC(Curve *c, f32 t);
void mtx_apply_vec3(f32 mf[4][4], f32 x, f32 y, f32 z, f32 *ox, f32 *oy, f32 *oz);
typedef struct {
    f32 v[3];
} Vec3E;
extern Vec3E D_801AD220;
extern u8 D_8018F565;
void func_000F0C08(s32 frame) {
    void **c = *(*(void *** *)((u8 *)(D_801ABA58) + (0xF0)));
    Vec3E up = D_801AD220;
    f32 t = (f32)frame / 30.0f;
    f32 dir[3];
    f32 side[3];
    f32 u[3];
    f32 mf[4][4];
    s32 i;
    if ((*(u8 *)((u8 *)(D_801ABA58) + (0xF8))) != 0 && D_8018F565 != 0) {
        for (i = 0; i < 3; i++) {
            D_801ABA58->eye[i] = func_000F4AFC(c[i], t);
        }
        for (i = 0; i < 3; i++) {
            D_801ABA58->at[i] = func_000F4AFC(c[i + 3], t);
        }
        if (c[7] != ((void *)0)) {
            f32 a = func_000F4AFC(c[7], t);
            dir[0] = D_801ABA58->at[0] - D_801ABA58->eye[0];
            dir[1] = D_801ABA58->at[1] - D_801ABA58->eye[1];
            dir[2] = D_801ABA58->at[2] - D_801ABA58->eye[2];
            D_8007FEE0(side, u, dir);
            D_8007FEE0(u, dir, side);
            func_00028900(mf, a, dir[0], dir[1], dir[2]);
            mtx_apply_vec3(mf, u[0], u[1], u[2], &up.v[0], &up.v[1], &up.v[2]);
        }
        for (i = 0; i < 3; i++) {
            D_801ABA58->up[i] = up.v[i];
        }
        if (c[6] != ((void *)0)) {
            D_801ABA58->fov = func_000F4AFC(c[6], t);
        } else {
            D_801ABA58->fov = (*(f32 *)((u8 *)((*(u8 * *)((u8 *)(D_801ABA58) + (0xF4)))) + (0x18)));
        }
    }
}
void mtx_apply_vec3(f32 mf[4][4], f32 x, f32 y, f32 z, f32 *ox, f32 *oy, f32 *oz);
