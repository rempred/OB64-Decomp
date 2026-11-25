typedef unsigned char u8;
typedef unsigned short u16;
extern u8 *D_80196AF8;
u8 func_000c1578(u16 l, u16 k);
u8 func_000c2f68(void);
void func_000c8490(void) {
    u8 *s = D_80196AF8;
    u8 r;
    if (s[0x9A] == 0 && func_000c1578((*(u16 *)((u8 *)(s) + (0x18C))), (*(u16 *)((u8 *)(s) + (0x19A)))) == 0xFF) {
        r = 1;
    } else if (D_80196AF8[0x9A] != 1) {
        r = 0;
    } else {
        r = func_000c2f68() != 0;
    }
    D_80196AF8[0x10B8] = r;
}
