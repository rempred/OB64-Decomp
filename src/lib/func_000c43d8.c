typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000c43d8(u8 l) {
    s32 i = 0;
    s32 o = l * 0x36;
    for (; i < 9; i++) {
        u8 *b = D_80196AF8;
        u8 m = (b + o + i)[0x1180];
        if ((m != 0) & (m != 0xFF)) {
            s32 o2 = m * 2 + 0x1872;
            (b + o2)[0] |= 0x20;
        }
    }
}
