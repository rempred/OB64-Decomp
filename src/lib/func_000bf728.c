typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
u8 func_000bf728(u8 l, u8 m) {
    u8 r = 0;
    s32 i;
    u8 *g = D_80196AF8 + 0x117C + l * 0x36;
    for (i = 0; i < 9; i++) {
        if ((g + i)[4] == m) {
            r++;
            break;
        }
    }
    return r;
}
