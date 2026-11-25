typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
u16 func_000c4380(void) {
    s32 i;
    s32 n;
    for (i = 0, n = 0; i < 6; i++) {
        u8 *b = D_80196AF8;
        u8 *g = b + (0x10D4 + i * 0xE);
        if (g[8] != 0) {
            if (g[1] & 0x10) {
                g[1] |= 0x80;
            } else {
                n++;
            }
        }
    }
    return n;
}
