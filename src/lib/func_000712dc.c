typedef unsigned char u8;
typedef unsigned short u16;
extern u8 *D_801951AC;
u16 *func_000712dc(u16 key) {
    u16 *p = (*(u16 * *)((u8 *)(D_801951AC) + (0x28)));
    u16 c = *p;
    while (c != 0x8197) {
        if (c == 0) {
            p++;
        }
        if (*p == key) {
            return p + 1;
        }
        p++;
        c = *p;
    }
    return (*(u16 * *)((u8 *)(D_801951AC) + (0x28))) + 1;
}
