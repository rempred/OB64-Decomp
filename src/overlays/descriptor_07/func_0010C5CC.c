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
s32 func_0012E968(void *);
s32 func_0012E950(s32);
void D_8020CDA0(s32 k);
extern u8 D_801969B8[];
extern u8 D_801F0FE0;
extern u8 D_801F0FE1;
extern u8 D_801F0FDF;
s32 func_00133028(u8 *);
s32 func_0012F530(void *);
void func_0010C5CC(void) {
    u32 *u = D_801F0CB0[D_801F3658];
    if (func_00133028(u) != 0) {
        if (*u & 0x40) {
            u8 *lg = &D_801969B8[func_0012E968(u) * 11];
            s32 i;
            for (i = 0; i < 5; i++) {
                u8 m = (lg + i)[2];
                if (m != 0xFF) {
                    *D_801F0CB0[func_0012E950(m)] &= ~0x20000;
                }
            }
        } else {
            *u &= ~0x20000;
        }
        D_801F0DE0 = 4;
        D_801F0FE1 = func_0012F530(u);
        D_801F0FE0 = 0;
        D_801F0FDF = 0;
    } else {
        D_801F0DE0 = 9;
        D_801F3680 = 0xB;
        D_801F36D0 = 0x10;
        D_8020CDA0(9);
        D_801F3674 = 1;
    }
}
