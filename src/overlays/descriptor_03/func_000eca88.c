typedef unsigned char u8;
typedef signed int s32;
extern u8 D_8018F520;
extern s32 D_8018F568;
extern u8 D_8018F56C;
extern u8 D_8018F56D;
void func_000eca88(void) {
    u8 *p = &D_8018F520;
    D_8018F568 = 0;
    D_8018F56C = 1;
    D_8018F56D = 1;
    *p |= 6;
}
