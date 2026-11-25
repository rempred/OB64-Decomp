typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
s32 D_8016FEF4(s16);
void func_00297C6C(u8 *o) {
    if (D_8016FEF4(1) != 1) {
        u8 *p = (*(u8 * *)((u8 *)(o) + (0xD0)));
        p[0x5F4]--;
        p[0x5F1]++;
        o[0x25]--;
    }
}
