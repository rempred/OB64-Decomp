typedef unsigned char u8;
extern u8 *D_80196AF8;
extern u8 D_80193BD1[][0x38];
u8 func_000bea90(u8 l);
u8 func_000bea90(u8 l) {
    u8 *b = D_80196AF8;
    u8 *g = b + l * 0x36;
    u8 id = (g + g[0x117F])[0x1180];
    u8 r = 0;
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
