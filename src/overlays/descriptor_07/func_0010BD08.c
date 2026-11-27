typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_801F0DE0;
extern s32 D_801F3658;
extern s8 D_801F3680;
extern s16 D_801F36D0;
extern u8 D_801F3674;
extern u32 *D_801F0CB0[];
extern void *D_8018F500;
extern s32 D_8018F504;
extern s32 D_8018F508;
void * func_0012E7E8(void *);
void func_0010BD08(void) {
    u32 fl;
    u32 **u;
    D_801F0DE0 = 9;
    u = &D_801F0CB0[D_801F3658];
    fl = **u;
    D_801F3680 = 7;
    if (!(fl & 0x40)) {
        D_801F36D0 = 0x1E;
    } else if (fl & 0x80) {
        D_801F36D0 = 0x7D;
    } else {
        D_801F36D0 = 0x80;
    }
    D_801F3674 = 2;
    D_8018F500 = func_0012E7E8(D_801F0CB0[D_801F3658]);
    D_8018F504 = 0;
    D_8018F508 = 0;
}
