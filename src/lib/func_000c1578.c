typedef unsigned char u8;
typedef unsigned short u16;
extern u8 *D_80196AF8;
u8 func_000c1578(u16 l, u16 k) {
    if (l < 0x80) {
        if (k < 9) {
            u8 *b = D_80196AF8;
            u8 *g = b + l * 0x36;
            g += k;
            return g[0x1180];
        } else {
            u16 n = (*(u16 *)((u8 *)(D_80196AF8) + (0x19A)));
            if (n < 13) {
                return (D_80196AF8 + n)[0x1A21];
            }
        }
    }
    return 0xFF;
}
