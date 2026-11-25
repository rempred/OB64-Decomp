typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
u8 func_000bbb9c(u8 sq) {
    u8 n = 0;
    s32 i;
    u8 *s = D_80196AF8 + 0x10D4 + sq * 0xE;
    for (i = 0; i < 5; i++) {
        if ((s + i)[2] != 0xFF) {
            n++;
        }
    }
    return n;
}
