typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_801F0DE0;
extern s32 D_801F3658;
extern u32 *D_801F0CB0[];
extern u8 D_801F0FDF;
extern u8 D_801F0FE0;
extern u8 D_801F0FE1;
s32 func_001914D0(void);
s32 D_801DADF0(u32 *u);
s32 func_001914D0(void);
void func_00191DE8(void) {
    u32 **u;
    if (func_001914D0() == 0) {
        D_801F0DE0 = 4;
        u = &D_801F0CB0[D_801F3658];
        D_801F0FE1 = D_801DADF0(*u);
        D_801F0FDF = 2;
        D_801F0FE0 = 0;
    }
}
