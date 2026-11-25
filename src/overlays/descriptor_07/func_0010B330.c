typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
extern s32 D_801F0E00;
extern s32 D_801F3658;
extern u32 *D_801F0CB0[];
extern u8 D_801969BA[];
extern s32 D_801F0E04;
s32 func_0012E968(u32 *u);
extern s32 D_801F0DFC;
extern s32 D_8018F58C;
extern u8 D_801E900C;
extern signed char D_801EE1C0[];
extern signed char D_801EE1E4[];
void func_00118644(u8 a, s32 loc);
s32 D_8017223C(s32 k);
void func_0010D484(f32 x, f32 z, s32 c, s32 d, s32 e);
void D_80186190(s32 a, s32 b);
void func_00023940(const signed char *fmt, ...);
void func_0010B330(void) {
    u32 *v;
    u32 *u = D_801F0CB0[D_801F3658];
    if (!(*u & 0x40)) {
        v = u;
    } else {
        v = D_801F0CB0[D_801969BA[func_0012E968(u) * 11]];
    }
    func_00118644(((u8 *)u)[4], v[0x74 / 4]);
    if (D_8017223C(4) != 0) {
        D_801F0DFC = 1;
        D_801F0E00 = D_801F3658;
        D_801F0E04 = *(s32 *)((u8 *)v + 0x74);
        func_0010D484(*(f32 *)((u8 *)u + 8), *(f32 *)((u8 *)u + 0xC), *(s32 *)((u8 *)u + 0x10), D_8018F58C, 0x23);
        D_80186190(0x1D, 1);
    } else if (D_801E900C == 0) {
        D_801E900C = 1;
        func_00023940(D_801EE1C0);
    } else {
        D_801E900C = 0;
        func_00023940(D_801EE1E4);
    }
}
