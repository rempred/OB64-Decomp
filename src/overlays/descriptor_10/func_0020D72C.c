typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_801CE8BC;
s32 func_0020D72C(void *record) {
    s32 i;
    u8 *base;
    if (record == ((void *)0)) {
        return -1;
    }
    base = D_801CE8BC;
    for (i = 0; i < 20; i++) {
        if (base + 0x1C4 + i * 0xF8 == record) {
            return i;
        }
    }
    return -1;
}
