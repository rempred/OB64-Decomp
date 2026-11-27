typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
struct Q7Unit;
extern s32 D_801F0DE0;
extern s32 D_801F0DE8;
extern s32 D_801F3658;
extern struct Q7Unit *D_801F0CB0[];
extern u8 D_801F365D;
extern s32 D_801F0E00;
extern s8 D_801F3680;
extern u8 D_801F0E07;
extern s16 D_801F36D0;
s32 D_8019FC8C(u8);
void D_8020CDA0(s32 k);
void func_0013A3D8(struct Q7Unit *, s32);
void D_801B2B78(void *unit);
void func_00120798(void) {
    if (D_8019FC8C(0) & 1) {
        switch (D_801F3680) {
        case 5:
            D_8020CDA0(0x17C);
            *(u32 *)D_801F0CB0[D_801F3658] &= ~0x20;
            break;
        case 14: {
            struct Q7Unit *unit = D_801F0CB0[D_801F0E00];
            u32 *u = (u32 *)unit;
            func_0013A3D8(unit, D_801F0E07);
            D_801B2B78(u);
            ((u8 *)u)[0x90] = 0;
            ((u8 *)u)[0x92] = 0;
            ((u8 *)u)[0x91] = 0;
            u[0x84 / 4] = -1;
            u[0x80 / 4] = -1;
            *u &= ~0x800000;
            break;
        }
        }
        D_801F3658 = -1;
        D_801F3680 = -1;
        D_801F0DE0 = 0;
        D_801F0DE8 = 0;
        D_801F36D0 = -1;
        D_801F365D &= 0xFE;
    }
}
