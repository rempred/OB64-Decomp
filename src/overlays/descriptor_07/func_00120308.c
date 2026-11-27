typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_801969C0[];
extern u8 D_80214EB8;
extern s32 D_801F0E04;
extern s32 D_801F0DE0;
extern s32 D_801F3658;
extern u32 *D_801F0CB0[];
extern u8 D_801F365D;
s32 func_0012E968(void *);
extern u8 D_80214EB9;
extern s32 D_801F0E00;
void func_0011D5EC(s32 k);
void func_0011D8D4(s32 k);
void func_00120308(void) {
    u8 c = D_80214EB9;
    if (c == 0xFF) {
        D_801F0DE0 = 1;
        D_801F3658 = D_801F0E00;
        D_801F365D &= 0xFE;
    } else if (!(c & 0x80)) {
        u32 *u = D_801F0CB0[D_801F0E00];
        s32 *p;
        s32 k;
        D_801969C0[func_0012E968(u) * 11] = D_80214EB8 + 1;
        k = func_0012E968(u);
        p = &D_801F0E04;
        if (*p != 0) {
            *p = k;
            func_0011D8D4(0);
        } else {
            *p = k;
            func_0011D5EC(0);
            u[0x1E] &= ~1;
        }
    }
}
