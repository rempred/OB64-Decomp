typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8019780C;
s32 memcmp_0002cc90(void *a, void *b, s32 n);
s32 func_000745c0(s32 i, void *a, void *b) {
    s32 o = i * 32 + 0x54;
    s32 r;
    if (memcmp_0002cc90(a, D_8019780C + o + 8, 2) != 0) {
        r = 0;
    } else {
        r = memcmp_0002cc90(b, D_8019780C + o + 4, 4) == 0;
    }
    return r;
}
