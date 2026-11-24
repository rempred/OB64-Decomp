#include "common/matrix_float.h"
typedef signed char s8;
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
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
extern u8 D_8018F53F;
extern Scene0E *D_801ABA58;
void guMtxCatF(f32 *m, f32 *n, f32 *r);
void mtx_apply_vec3(f32 mf[4][4], f32 x, f32 y, f32 z, f32 *ox, f32 *oy, f32 *oz);
extern u32 D_8018F530;
extern u8 D_8018F557;
extern u8 D_8018F558;
extern u8 D_8018F559;
extern u32 D_8018F530;
void guTranslateF(f32 mf[4][4], f32 x, f32 y, f32 z);
void mtx_apply_vec3(f32 mf[4][4], f32 x, f32 y, f32 z, f32 *ox, f32 *oy, f32 *oz);
void D_8007FFD0(f32 *v);
void D_80080190(f32 *v, f32 s);
extern f32 D_801AC0D8[8];
extern f32 D_801ABDD8[8][2][4][3];
typedef struct {
    u8 acol[4];
    u8 acolc[4];
    u8 col[4];
    u8 colc[4];
    s8 dir[4];
} Lights0E;
extern Lights0E D_801ABA40;
extern u8 D_8018F557;
extern u8 D_8018F558;
extern u8 D_8018F559;
void func_000F309C(f32 lo, f32 hi, f32 x, f32 *from, f32 *to, u8 *out);
void func_000F286C(void) {
    f32 m[4][4];
    f32 r[4][4];
    f32 v[3];
    u8 c[3];
    s32 i;
    s32 j;
    f32 hi;
    u32 k;
    for (i = 7; i > 0; i--) {
        if (D_801AC0D8[i] <= (*(f32 *)((u8 *)(D_801ABA58) + (0x12C)))) {
            break;
        }
    }
    for (j = 1; j < 8; j++) {
        if ((*(f32 *)((u8 *)(D_801ABA58) + (0x12C))) <= D_801AC0D8[j]) {
            break;
        }
    }
    func_00028900(m, -60.0f, 1.0f, 0.0f, 0.0f);
    func_00028900(r, (*(f32 *)((u8 *)(D_801ABA58) + (0x12C))), 0.0f, 1.0f, 0.0f);
    guMtxCatF((f32 *)r, (f32 *)m, (f32 *)m);
    guTranslateF(r, -50.0f, 0.0f, 0.0f);
    guMtxCatF((f32 *)r, (f32 *)m, (f32 *)m);
    mtx_apply_vec3(m, 0.0f, 0.0f, 0.0f, &v[0], &v[1], &v[2]);
    D_8007FFD0(v);
    j &= 7;
    D_80080190(v, 119.0f);
    D_801ABA40.dir[0] = v[0];
    D_801ABA40.dir[1] = v[1];
    D_801ABA40.dir[2] = v[2];
    hi = D_801AC0D8[j];
    if (hi < D_801AC0D8[i]) {
        hi += 360.0f;
    }
    func_000F309C(D_801AC0D8[i], hi, (*(f32 *)((u8 *)(D_801ABA58) + (0x12C))),
                             D_801ABDD8[i][1][D_8018F53F], D_801ABDD8[j][1][D_8018F53F], c);
    k = c[0] * D_8018F530 >> 16;
    if ((u8)k < 0x20) {
        k = 0x20;
    }
    D_801ABA40.acolc[0] = k;
    D_801ABA40.acol[0] = k;
    k = c[1] * D_8018F530 >> 16;
    if ((u8)k < 0x20) {
        k = 0x20;
    }
    D_801ABA40.acolc[1] = k;
    D_801ABA40.acol[1] = k;
    k = c[2] * D_8018F530 >> 16;
    if ((u8)k < 0x20) {
        k = 0x20;
    }
    D_801ABA40.acolc[2] = k;
    D_801ABA40.acol[2] = k;
    hi = D_801AC0D8[j];
    if (hi < D_801AC0D8[i]) {
        hi += 360.0f;
    }
    func_000F309C(D_801AC0D8[i], hi, (*(f32 *)((u8 *)(D_801ABA58) + (0x12C))),
                             D_801ABDD8[i][0][D_8018F53F], D_801ABDD8[j][0][D_8018F53F], c);
    k = c[0] * D_8018F530 >> 16;
    if ((u8)k < 0x20) {
        k = 0x20;
    }
    D_801ABA40.colc[0] = k;
    D_801ABA40.col[0] = k;
    k = c[1] * D_8018F530 >> 16;
    if ((u8)k < 0x20) {
        k = 0x20;
    }
    D_801ABA40.colc[1] = k;
    D_801ABA40.col[1] = k;
    k = c[2] * D_8018F530 >> 16;
    if ((u8)k < 0x20) {
        k = 0x20;
    }
    D_801ABA40.colc[2] = k;
    D_801ABA40.col[2] = k;
    D_8018F557 = c[0];
    D_8018F558 = c[1];
    D_8018F559 = c[2];
}
void func_000F309C(f32 lo, f32 hi, f32 x, f32 *from, f32 *to, u8 *out);
