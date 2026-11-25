typedef unsigned char u8;
typedef unsigned int u32;
extern u32 D_8018F534;
extern u8 D_8018F53D;
void func_000ecc4c(u32 d);
void func_000ecc4c(u32 d) {
    if (D_8018F53D == 0) {
        D_8018F534 += d;
        if (D_8018F534 > 0x10000) {
            D_8018F534 = 0x10000;
        }
    } else if (D_8018F534 < d) {
        D_8018F534 = 0;
    } else {
        D_8018F534 -= d;
    }
}
