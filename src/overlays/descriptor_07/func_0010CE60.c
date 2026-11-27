typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern s32 D_801F0DE0;
extern s8 D_801F3680;
extern s16 D_801F36D0;
extern u8 D_801F3674;
s32 func_00130794(void);
s32 D_80186210(s32 k);
void func_0010CE60(void) {
    D_801F0DE0 = 9;
    D_801F3680 = 13;
    if (func_00130794() != 0) {
        D_801F36D0 = 0x2F;
    } else if (D_80186210(0x11) != 0) {
        D_801F36D0 = 0x35;
    } else {
        D_801F36D0 = 0x23;
    }
    D_801F3674 = 2;
}
