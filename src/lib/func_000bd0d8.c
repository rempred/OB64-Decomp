typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
u16 func_000bd0d8(u16 m) {
    u8 *b = D_80196AF8;
    u8 *g = b + m * 0x36;
    u8 sq = g[0x117E];
    u8 *s = b + 0x10D4 + sq * 0xE;
    s32 i;
    if (sq != 0xFF) {
        for (i = 0; i < 9; i++) {
            if ((s + i)[2] == m) {
                return i;
            }
        }
    }
    return 0xFF;
}
