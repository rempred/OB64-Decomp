typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u16 D_800E79B0;
extern u8 D_800E9C0A[];
u8 *D_801CC464(void);
s32 func_000c55b8(void) {
    s32 r = 0;
    if (D_800E9C0A[0xD] == 0) {
        u8 *w = D_801CC464();
        if (w == ((void *)0) || (*(u16 *)((u8 *)(w) + (0xEA))) == 0) {
            if (D_800E79B0 & 0x2020) {
                if (!(D_80196AF8[0xA0] & 0x80)) {
                    r = 1;
                }
            }
        }
    }
    return r;
}
