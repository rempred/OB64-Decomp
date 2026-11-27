typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
u8 func_000c1578(u16 l, u16 k);
u8 func_000c2f68(void);
s32 func_000c7d00(void) {
    u8 *s = D_80196AF8;
    if (s[0x9A] == 0) {
        if (func_000c1578((*(u16 *)((u8 *)(s) + (0x18C))), (*(u16 *)((u8 *)(s) + (0x19A)))) == 0xFF) {
            return 1;
        }
    }
    if (D_80196AF8[0x9A] != 1) {
        return 0;
    }
    return func_000c2f68() != 0;
}
