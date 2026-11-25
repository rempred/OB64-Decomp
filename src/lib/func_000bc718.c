typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
u8 func_00195410_helper(u16 id);
extern StockEntry D_80196B00[];
u8 func_00195410_helper(u16 item);
u16 func_000bc718(u16 k) {
    u16 n = 0;
    s32 i;
    u8 c;
    u16 *out;
    if (k == 0) {
        return 0;
    }
    c = func_00195410_helper(k);
    out = (u16 *)(D_80196AF8 + 0x1BEE);
    for (i = 0; i < 0x116; i++) {
        if (D_80196B00[i].id != 0 && D_80196B00[i].count != 0 && func_00195410_helper(D_80196B00[i].id) == c) {
            n++;
            *out++ = i;
        }
    }
    *out = 0;
    return n;
}
