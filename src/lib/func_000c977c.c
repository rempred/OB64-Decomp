typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u16 D_800E8100;
void func_000c54c0(s32 k);
s32 func_000b246c(void);
s32 func_000b31c0(void);
void func_000c54c0(s32 se);
s32 func_000c977c(u8 *tbl, u16 *cur, u8 alt) {
    s32 r = 0;
    u16 b = D_800E8100;
    u16 v = *cur;
    if (b & 0x1000) {
        r = 3;
    } else if (b & 0x8000) {
        r = 1;
    } else if (b & 0x4000) {
        func_000c54c0(1);
        r = 2;
    } else {
        s32 d;
        if (alt) {
            d = func_000b31c0();
        } else {
            d = func_000b246c();
        }
        if (d >= 0) {
            v = (tbl + v * 6 + d)[-6];
        }
    }
    if (v != 0) {
        *cur = v;
    }
    return r;
}
