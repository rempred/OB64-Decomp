typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
extern StockEntry D_80193AC0[];
unsigned char D_8016F520(int);
u16 func_000bc3b8(void) {
    s32 i;
    u16 n = 0;
    u16 *out = (u16 *)(D_80196AF8 + 0x1BEE);
    for (i = 0; i < 0x28; i++) {
        if ((D_80193AC0[i].id != 0) & (D_80193AC0[i].count != 0)) {
            if (D_8016F520(D_80193AC0[i].id) == 0) {
                n++;
                *out++ = i;
            }
        }
    }
    return n;
}
