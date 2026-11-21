typedef signed int s32;
typedef unsigned int u32;
u32 func_0006f47c(u32 rgba) {
    s32 g = (rgba >> 16) & 0xFF;
    s32 r;
    s32 b = (rgba >> 8) & 0xFF;
    u32 a = rgba & 0xFF;
    s32 max = rgba >> 24;
    if (max < g) {
        max = g;
    }
    if (max < b) {
        max = b;
    }
    if (max < 128) {
        r = max * 112 / 128 + 24;
        g = max * 112 / 128 + 28;
        b = max * 96 / 128 + 8;
    } else {
        r = max * 80 / 128 + 56;
        g = max * 80 / 128 + 60;
        b = max * 80 / 128 + 40;
    }
    r <<= 8;
    return (((u32)r << 16) + ((u32)g << 16) + ((u32)b << 8)) | a;
}
