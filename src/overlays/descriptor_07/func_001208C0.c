typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_801F0DE0;
extern s32 D_801F0DE8;
extern u32 *D_801F0CB0[];
extern s32 D_801F367C;
extern u8 D_801F365D;
void D_801D25E4(u32 *u);
void func_001208C0(void) {
    s32 i;
    s32 any;
    i = 0;
    any = 0;
    for (; i < D_801F367C; i++) {
        u32 *u = D_801F0CB0[i];
        if (*u & 0x1000) {
            D_801D25E4(u);
            *u |= 0x40000;
            if (*u & 0x1000) {
                any = 1;
            }
        }
    }
    if (!any) {
        D_801F0DE0 = 0;
        D_801F0DE8 = 0;
        D_801F365D &= 0xFE;
    }
}
