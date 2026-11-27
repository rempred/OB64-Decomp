typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
s32 func_00067570(u32 fmt, u8 *img) {
    s32 r;
    if (fmt & 1) {
        r = ((((*(u16 *)((u8 *)(img) + (4))) + 3U) >> 2) << 3) * (*(u16 *)((u8 *)(img) + (6)));
    } else if ((fmt & 3) == 3) {
        r = ((((*(u16 *)((u8 *)(img) + (4))) + 3U) >> 2) << 4) * (*(u16 *)((u8 *)(img) + (6)));
    } else {
        u32 w = (*(u16 *)((u8 *)(img) + (4)));
        u32 a = (w + 3) >> 2;
        u32 b = (w + 7) >> 3;
        r = ((b + a) << 3) * (*(u16 *)((u8 *)(img) + (6)));
    }
    return r;
}
