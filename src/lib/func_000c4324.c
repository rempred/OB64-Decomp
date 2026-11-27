typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
u16 func_000c4324(void) {
    s32 i;
    s32 n;
    for (i = 0, n = 0; i < 0x1E; i++) {
        u8 *b = D_80196AF8;
        u8 *g = b + (0x117C + i * 0x36);
        if (g[3] != 0xFF) {
            if (g[1] & 0x10) {
                g[1] |= 0x80;
            } else {
                n++;
            }
        }
    }
    return n;
}
