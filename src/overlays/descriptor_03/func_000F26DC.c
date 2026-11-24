#include "common/matrix_float.h"
typedef unsigned char u8;
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
void guMtxCatF(f32 *m, f32 *n, f32 *r);
void mtx_apply_vec3(f32 mf[4][4], f32 x, f32 y, f32 z, f32 *ox, f32 *oy, f32 *oz);
void guTranslateF(f32 mf[4][4], f32 x, f32 y, f32 z);
void mtx_apply_vec3(f32 mf[4][4], f32 x, f32 y, f32 z, f32 *ox, f32 *oy, f32 *oz);
void D_80080210(f32 *out, f32 *a, f32 *v, f32 b, f32 c);
void D_8007FFD0(f32 *v);
void D_80080190(f32 *v, f32 s);
void func_000F26DC(void) {
    f32 m[4][4];
    f32 r[4][4];
    f32 out[4];
    f32 v[3];
    D_801ABA58->unk110[0x28] = 0;
    if ((*(f32 *)((u8 *)(D_801ABA58) + (0x12C))) < 15.0f || (*(f32 *)((u8 *)(D_801ABA58) + (0x12C))) > 165.0f) {
        return;
    }
    func_00028900(m, 60.0f, 1.0f, 0.0f, 0.0f);
    func_00028900(r, (*(f32 *)((u8 *)(D_801ABA58) + (0x12C))), 0.0f, -1.0f, 0.0f);
    guMtxCatF((f32 *)r, (f32 *)m, (f32 *)m);
    guTranslateF(r, -50.0f, 0.0f, 0.0f);
    guMtxCatF((f32 *)r, (f32 *)m, (f32 *)m);
    mtx_apply_vec3(m, 0.0f, 0.0f, 0.0f, &v[0], &v[1], &v[2]);
    if (v[1] > 0.0f) {
        D_80080210(out, (f32 *)&D_801ABA58->unk000[0x18], v, (*(f32 *)((u8 *)(D_801ABA58) + (0x1C))),
                      v[1]);
        D_801ABA58->unk110[0x28] = 1;
        (*(f32 *)((u8 *)(D_801ABA58) + (0x130))) = out[0];
        (*(f32 *)((u8 *)(D_801ABA58) + (0x134))) = out[2];
        D_8007FFD0(v);
        D_80080190(v, 100.0f);
    }
}
