typedef unsigned char u8;
typedef signed int s32;
extern void *D_8021B480[];
extern u8 D_8021B484[];
extern u8 D_8021B489;
extern s32 D_801F3618;
void D_8017C384(void *w);
void func_00189688(void) {
    s32 i;
    D_8021B489 = 0;
    for (i = 4; i >= 0; i--) {
        if (D_8021B484[i] != 0) {
            D_8017C384(D_8021B480[i - 4]);
        }
    }
    D_801F3618 = -1;
}
