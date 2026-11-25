typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern s32 D_801EB284;
extern signed char *D_801ED42C;
extern u16 D_801F0B50;
void D_801DE440(u16 k);
u16 D_801794C8(signed char *s);
s32 D_8017BFB0(u16, u8, void *c, s16, s16, s16, s16, s16, s16, s16, s16);
void D_8020CDA0(s32 k);
void func_001AF754(u8 *o, s32 k);
void func_001AF754(u8 *o, s32 k);
void func_001AF828(s32 k) {
    if ((u16)k != 0) {
        D_801DE440(k);
    } else {
        s32 w = (u16)D_801794C8(D_801ED42C);
        D_801EB284 = D_8017BFB0(4, 0, func_001AF754, 0x9E, 0x7E, 0xA2, 0x82, (s16)(0x9C - (w >> 1)), 0x76,
                                   (s16)((w >> 1) + 0xA4), 0x8A);
        D_8020CDA0(0x2D3);
        D_801F0B50 = k;
    }
}
