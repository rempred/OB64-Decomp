typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
extern u16 (*D_801EF288[])(u8 cls, u8 base);
u16 D_8016B6FC(u16 k);
extern StockEntry D_80196B00[];
s32 func_000bf88c(u8 x);
s32 func_000bf88c(u8 x) {
    s32 i;
    s32 r;
    for (i = 0, r = 0; i < 4; i++) {
        u16 k = D_801EF288[i](x, x);
        if (k != 0) {
            u16 slot = D_8016B6FC(k);
            if (slot != 0x1FF && D_80196B00[slot].count >= 99) {
                r = 1;
            }
        }
    }
    return r;
}
