typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
extern StockEntry D_80196B00[];
u16 D_8016DF88(u8, u8);
u16 D_8016DFDC(u8, u8);
u16 D_8016E030(u8, u8);
u16 D_8016E084(u8, u8);
u16 D_8016B6FC(u16 id);
s32 func_001B5FE0(void) {
    u16 ids[4];
    s32 i;
    ids[0] = D_8016DF88(0x24, 0x24);
    ids[1] = D_8016DFDC(0x24, 0x24);
    ids[2] = D_8016E030(0x24, 0x24);
    ids[3] = D_8016E084(0x24, 0x24);
    for (i = 0; i < 4; i++) {
        if (ids[i] != 0) {
            u16 s = D_8016B6FC(ids[i]);
            if (s >= 0x117 || !(D_80196B00[s].count > D_80196B00[s].equipped)) {
                return 0;
            }
        }
    }
    return 1;
}
