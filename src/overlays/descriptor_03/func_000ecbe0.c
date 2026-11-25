typedef unsigned char u8;
typedef unsigned int u32;
extern u32 D_8018F530;
extern u8 D_8018F53C;
void func_000ecbe0(u32 d) {
    if (D_8018F53C == 0) {
        D_8018F530 += d;
        if (D_8018F530 > 0x10000) {
            D_8018F530 = 0x10000;
        }
    } else if (D_8018F530 < d) {
        D_8018F530 = 0;
    } else {
        D_8018F530 -= d;
    }
}
