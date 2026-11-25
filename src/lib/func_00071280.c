typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_801951AC;
u16 *func_00071280(u16 *p, s32 n) {
    u16 c = *p;
    u8 k = n - 1;
    while (c != 0x8197) {
        if (c == 0) {
            p++;
            k--;
        }
        if (k == 0) {
            return p;
        }
        p++;
        c = *p;
    }
    return (*(u16 * *)((u8 *)(D_801951AC) + (0x2C)));
}
