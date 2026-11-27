typedef unsigned char u8;
typedef signed int s32;
void func_00078344(u8 *src, u8 *dst, s32 n) {
    u8 buf[1];
    s32 i;
    s32 len = 0;
    for (i = 0; i < n; i++) {
        u8 c = src[i];
        if (c == 0 || (u8)(c - 0xF) < 0x33) {
            dst[len] = c;
        } else {
            dst[len] = 0xF;
        }
        len++;
    }
    dst[len] = 0;
}
