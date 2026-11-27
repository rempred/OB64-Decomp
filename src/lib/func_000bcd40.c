typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
u8 func_000bea90(u8 l);
u16 func_000bcd40(void) {
    s32 i;
    s32 n;
    for (i = 0, n = 0; i < 0x1E; i++) {
        u8 *g = D_80196AF8 + 0x117C + i * 0x36;
        if (g[3] != 0xFF) {
            if (func_000bea90(i) != 0) {
                g[1] |= 0x80;
            } else {
                n++;
            }
        }
    }
    return n;
}
u8 func_000bea90(u8 l);
