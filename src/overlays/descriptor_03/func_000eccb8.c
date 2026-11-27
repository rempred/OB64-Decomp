typedef unsigned char u8;
typedef unsigned int u32;
extern u32 D_8018F538;
extern u8 D_8018F53E;
void func_000eccb8(u32 d);
void func_000eccb8(u32 d) {
    if (D_8018F53E == 0) {
        D_8018F538 += d;
        if (D_8018F538 > 0x10000) {
            D_8018F538 = 0x10000;
        }
    } else if (D_8018F538 < d) {
        D_8018F538 = 0;
    } else {
        D_8018F538 -= d;
    }
}
