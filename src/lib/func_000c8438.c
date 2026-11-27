typedef unsigned char u8;
extern u8 *D_80196AF8;
u8 func_000c7d6c(u8 l);
void func_000c8438(u8 l) {
    D_80196AF8[0xA2] = 0;
    if (l >= 0x80) {
        D_80196AF8[0x10B8] = 1;
    } else {
        D_80196AF8[0x10B8] = func_000c7d6c(l) != 0;
    }
}
