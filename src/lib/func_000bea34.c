typedef unsigned char u8;
typedef signed int s32;
extern u8 D_80193BD1[][0x38];
s32 func_000bea34(u8 id) {
    s32 r = 0;
    if (id >= 100 || id == 0) {
    } else {
        u8 c = D_80193BD1[id][0];
        if ((u8)(c - 0x51) < 3) {
            r = 1;
        } else if (c == 0xA3) {
            r = 1;
        }
    }
    return r;
}
