typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
u8 func_000bbb34(u16 l) {
    u8 n = 0;
    s32 i;
    u8 *b = D_80196AF8;
    u8 *g = b + l * 0x36;
    for (i = 0; i < 9; i++) {
        if ((g + i)[0x1180] >= 100 && (g + i)[0x1180] != 0xFF) {
            n++;
        }
    }
    return n;
}
