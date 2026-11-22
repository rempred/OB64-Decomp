typedef unsigned char u8;
typedef signed int s32;

u8 D_8016DE1C(s32 a, s32 b);
s32 func_0020C284(void *record) {
    if (record == ((void *)0)) {
        return 0;
    }
    return D_8016DE1C(((const u8 *)record)[0x4B], ((const u8 *)record)[0x4F]) == 2;
}
