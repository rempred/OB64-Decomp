typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
extern StockEntry D_80193AC0[];
u16 func_000bceb0(void) {
    u16 n = 0;
    s32 i;
    for (i = 0; i < 0x28; i++) {
        if (D_80193AC0[i].id != 0) {
            n++;
        }
    }
    return n;
}
