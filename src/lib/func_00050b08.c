typedef unsigned char u8;
typedef signed int s32;
void func_00050b08(s32 src, u8 *dst) {
    s32 pos = 0;
    s32 i;
    for (i = 0; i < 56; i++) {
        s32 q = pos >> 2;
        s32 sh = (pos & 3) * 2;
        u8 *p = (u8 *)src + q;
        s32 v = (p[0] << sh) | (p[1] >> (8 - sh));
        switch (i & 3) {
            case 0:
                pos += 4;
                dst[0] = ((v >> 2) & 0x30) | ((v >> 4) & 3);
                dst[1] = ((v << 2) & 0x30) | (v & 3);
                break;
            case 1:
                pos += 4;
                dst[2] = ((v >> 2) & 0x30) | ((v >> 4) & 3);
                dst[3] = ((v << 2) & 0x30) | (v & 3);
                break;
            case 2:
                pos += 3;
                dst[4] = ((v >> 2) & 0x30) | ((v >> 4) & 3);
                dst[5] = (v << 2) & 0x30;
                break;
            case 3:
                dst[6] = 0;
                dst[7] = 0;
                dst += 8;
                break;
        }
    }
}
void func_00050b08(s32 src, u8 *dst);
