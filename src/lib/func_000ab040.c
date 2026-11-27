typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
s32 func_000ab040(s32 k) {
    s32 o = k * 54 + 0x117C;
    u8 *p = D_80196AF8 + o;
    s32 r;
    if ((p[0xE] & p[0xF] & p[0x10]) == 0xF) {
        if ((p[0x11] & p[0x12] & p[0x13]) == 0xF) {
            r = (p[0x17] | p[0x18] | p[0x19] | p[0x1A] | p[0x1B] | p[0x1C]) != 0;
        } else {
            r = 3;
        }
    } else {
        r = 4;
        if ((p[0x11] & p[0x12] & p[0x13]) == 0xF) {
            r = 2;
        }
    }
    return r;
}
