typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
s32 func_000bbadc(u8 *a, u8 *b) {
    s32 r;
    *a = 0;
    *b = 0;
    r = 0;
    if ((*(s32 *)((u8 *)(D_80196AF8) + (0x2C4))) >= 0x1E) {
        *a = (*(s32 *)((u8 *)(D_80196AF8) + (0x2C4))) - 0x1D;
        r = 1;
    }
    if ((*(s32 *)((u8 *)(D_80196AF8) + (0x5D8))) >= 0x60) {
        *b = (*(s32 *)((u8 *)(D_80196AF8) + (0x5D8))) - 0x5F;
        r = 1;
    }
    return r;
}
