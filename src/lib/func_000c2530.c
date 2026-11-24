typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u8 D_801EF474[];
extern s8 D_801EF480[];
unsigned char D_8016DE1C(int, int);
extern u8 D_80193BC0_copy[][0x38];
u8 func_000c2530(u16 sq, u8 m, u8 pos) {
    s32 n = 0;
    s32 k;
    u8 *q = D_80196AF8 + (sq * 0x36 + 0x117C);
    for (k = 0; k < 8; k++) {
        if ((D_801EF474[pos] >> k) & 1) {
            u8 c = (q + (pos + D_801EF480[k]))[4];
            if ((c != 0xFF) & (c != m)) {
                u8 *u = D_80193BC0_copy[0];
                if (c < 100) {
                    u = D_80193BC0_copy[c];
                }
                if ((unsigned char)D_8016DE1C((unsigned char)(u[0x11]),(unsigned char)(u[0x12])) == 2) {
                    n++;
                    break;
                }
            }
        }
    }
    return n;
}
