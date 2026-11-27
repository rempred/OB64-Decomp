typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_801F0E04;
extern s32 D_801F0DE0;
extern s32 D_801F0DE8;
extern s32 D_801F3658;
extern u32 *D_801F0CB0[];
extern u8 D_801F365D;
extern u8 D_801F0FE0;
s32 func_0012E968(void *);
extern s32 D_801F0E00;
extern s8 D_801F3680;
extern s16 D_801F36D0;
void D_8020CDA0(s32 k);
extern u8 D_80213780;
extern u8 D_80213781;
extern u8 D_80213782;
void *func_000016C4(void *ptr);
extern void *D_801F39A8;
extern u8 D_801F3674;
extern s8 D_801F0B20[];
extern void *D_8018F500;
extern s32 D_8018F504;
extern s32 D_8018F508;
s32 func_0010D1E8(void);
s32 func_0012E8EC(void *);
void func_0012DBB4(s32, s8 *);
void * func_0012E7E8(void *);
void func_00120080(void) {
    u8 *r = &D_80213780;
    u32 *u;
    if (r[0] == 0) {
        return;
    }
    func_000016C4(D_801F39A8);
    D_801F39A8 = ((void *)0);
    if (D_80213781 != 0) {
        if (D_80213781 == 0xFF) {
            D_801F3658 = -1;
            D_801F0DE0 = 3;
            D_801F0DE8 = 0;
            D_801F0FE0 = 0;
            D_801F365D |= 1;
        }
        return;
    }
    u = D_801F0CB0[D_80213782];
    if (*u & 0x40) {
        s32 a = func_0010D1E8();
        s32 b = func_0012E8EC(u);
        if (a < b) {
            s8 *s;
            D_801F0DE0 = 9;
            D_801F3680 = -1;
            D_801F36D0 = 0x19;
            D_8020CDA0(9);
            s = D_801F0B20;
            D_801F3674 = 1;
            func_0012DBB4(b, s);
            D_8018F500 = s;
            func_0012DBB4(10 - a, s + 8);
            D_8018F504 = (s32)(s + 8);
            func_0012DBB4(a, s + 0x10);
            D_8018F508 = (s32)(s + 0x10);
            return;
        }
        if (*u & 0x40) {
            D_801F0E04 = func_0012E968(u);
        }
    }
    D_801F0DE0 = 9;
    D_801F0E00 = r[2];
    D_8018F500 = func_0012E7E8(u);
    {
        u32 f = *u;
        D_801F3680 = 2;
        if (f & 0x40) {
            D_801F36D0 = 0x7C;
        } else {
            D_801F36D0 = 0x1D;
        }
    }
    D_801F3674 = 2;
}
