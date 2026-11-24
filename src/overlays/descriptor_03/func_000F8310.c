typedef unsigned char u8;
typedef unsigned int u32;
u32 func_000F8310(u8 *src, u32 size, void *dst);
u32 func_000F8310(u8 *src, u32 size, void *dst) {
    u32 in = 0;
    u8 fill = 0xFF;
    u32 out = 0;
    u8 c;
    u8 n;
    u8 i;
    while (in < size) {
        n = src[in++];
        c = n;
        if (c < 0x80) {
            n = c + 1;
            for (i = 0; i < n; i++) {
                ((u8 *)dst)[out++] = src[in++];
            }
        } else if (!(c & 0x40)) {
            n = (c & 0x3F) + 2;
            for (i = 0; i < n; i++) {
                ((u8 *)dst)[out++] = 0;
            }
        } else if (!(c & 0x20)) {
            n = (c & 0x1F) + 2;
            for (i = 0; i < n; i++) {
                ((u8 *)dst)[out++] = fill;
            }
        } else {
            fill = src[in++];
            n = (c & 0x1F) + 3;
            for (i = 0; i < n; i++) {
                ((u8 *)dst)[out++] = fill;
            }
        }
    }
    return out;
}
