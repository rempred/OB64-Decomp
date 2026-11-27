typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000da77c(void) {
    s32 i;
    for (i = 0; i < 0x1E; i++) {
        u8 *b = D_80196AF8;
        u8 *g = b + (0x117C + i * 0x36);
        if (g[3] != 0xFF && g[2] == 10) {
            g[2] = 0xFF;
            g[1] &= 0xF7;
        }
    }
}
