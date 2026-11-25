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
u16 D_8016B738(u16 id);
u16 func_000bb584(u8 remove, u16 id) {
    s32 i;
    s32 j;
    s32 n;
    for (i = 0, n = 0; i < 0x1E; i++) {
        u8 *b = D_80196AF8;
        u8 *g = b + (0x117C + i * 0x36);
        if (g[3] == 0xFF || (g[1] & 0x10)) {
            continue;
        }
        for (j = 0; j < 10; j++) {
            u16 *e = (u16 *)(g + j * 2 + 0x22);
            if (*e == id) {
                n++;
                if (remove) {
                    D_80193AC0[D_8016B738(*e)].equipped--;
                    *e = 0;
                }
            }
        }
    }
    return n;
}
