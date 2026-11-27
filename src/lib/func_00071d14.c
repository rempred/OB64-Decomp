typedef signed short s16;
typedef unsigned short u16;
extern u16 D_800E8700;
extern u16 D_800E8100;
s16 func_00071d14(void) {
    u16 *p = &D_800E8700;
    s16 r = -1;
    if (*p & 0x800) {
        r = 2;
    } else if (*p & 0x400) {
        r = 3;
    } else if (*p & 0x200) {
        r = 4;
    } else if (*p & 0x100) {
        r = 5;
    } else if (D_800E8100 & 0x8000) {
        r = 0;
    } else if (D_800E8100 & 0x4000) {
        r = 1;
    } else if (D_800E8100 & 0x1000) {
        r = 6;
    } else if (*p & 0x20) {
        r = 7;
    } else if (*p & 0x10) {
        r = 8;
    } else if (*p & 0x2000) {
        r = 9;
    } else if (*p & 2) {
        r = 10;
    } else if (*p & 1) {
        r = 11;
    }
    return r;
}
