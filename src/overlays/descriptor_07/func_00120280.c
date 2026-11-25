typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_801969C0[];
extern u8 D_80214EB8;
extern s32 D_801F0E04;
extern s32 D_801F0DE0;
extern s32 D_801F3658;
extern u32 *D_801F0CB0[];
extern u8 D_801F0FDF;
extern u8 D_801F0FE0;
extern u8 D_801F0FE1;
u8 func_0012F530(u32 *u);
void func_00120280(void) {
    u32 **u;
    D_801969C0[D_801F0E04 * 11] = D_80214EB8 + 1;
    D_801F0DE0 = 4;
    u = &D_801F0CB0[D_801F3658];
    D_801F0FE1 = func_0012F530(*u);
    D_801F0FDF = 3;
    D_801F0FE0 = 0;
}
