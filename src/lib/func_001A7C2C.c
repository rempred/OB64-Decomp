void *func_000016C4(void *pointer);
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
extern void *D_80214E80;
extern u8 D_8021962B;
extern u8 D_8021962C;
extern s32 D_801F3658;
extern u8 D_801971F2[];
extern u8 D_80193BD8[];
extern u8 D_80193BF3[];
extern u32 *D_801F0CB0[];
extern s32 D_80219658;
void D_801B2D2C(u32 *u);
void func_001A7C2C(void) {
    func_000016C4(D_80214E80);
    if (D_8021962B != 0 || D_8021962C != 0) {
        u8 m = D_801971F2[D_801F3658 * 25];
        if ((D_8021962B != 0 && *(u16 *)(D_80193BD8 + m * 56) != 0) ||
            (D_8021962C != 0 && !(D_80193BF3[m * 56] & 4))) {
            u32 *u = D_801F0CB0[D_801F3658];
            D_801B2D2C(u);
            *u &= ~0x800000;
            ((u8 *)u)[0x92] = 0;
            ((u8 *)u)[0x91] = 0;
            ((u8 *)u)[0xB8] = 0;
            u[0x84 / 4] = -1;
            u[0x80 / 4] = -1;
            ((f32 *)u)[0x4C / 4] = ((f32 *)u)[2];
            ((f32 *)u)[0x50 / 4] = ((f32 *)u)[3];
            ((f32 *)u)[0x54 / 4] = ((f32 *)u)[4];
            u[0x64 / 4] = u[5];
            *u &= ~0x2000000;
        }
    }
    D_80219658 = 0;
}
