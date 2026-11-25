typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
u8 func_000c7d6c(u8 l);
void func_000c8858(u8 l) {
    u8 *s = D_80196AF8;
    if (s[0x9A] == 1) {
        s[0xA2] = 0;
        if (l >= 0x80) {
            D_80196AF8[0x10B8] = 1;
        } else {
            D_80196AF8[0x10B8] = func_000c7d6c(l) != 0;
        }
    } else if ((*(s32 *)((u8 *)(s) + (0x1BD4))) == 11 || ((*(s32 *)((u8 *)(s) + (0x1BD4))) == 9 && (*(u16 *)((u8 *)(s) + (0x182))) == 1)) {
        s[0xA2] = 0;
        if (l >= 0x80) {
            D_80196AF8[0x10B8] = 1;
        } else {
            D_80196AF8[0x10B8] = func_000c7d6c(l) != 0;
        }
    } else {
        D_80196AF8[0x10B8] = 0;
    }
}
