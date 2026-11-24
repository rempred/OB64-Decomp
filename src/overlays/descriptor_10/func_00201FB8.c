typedef unsigned short u16;
typedef unsigned int u32;
u16 func_00201FB8(u16 c) {
    u32 r = (c >> 8) & 0xF8;
    u32 g = (c >> 3) & 0xF8;
    u32 b = (c << 2) & 0xF8;
    u32 lum = r * 30 + g * 59 + b * 11;
    r = lum * 255 / 30000;
    g = lum / 150;
    b = lum * 130 / 30000;
    lum = ((r & 0xF8) << 8) + ((g & 0xF8) << 3) + ((b & 0xF8) >> 2) + (c & 1);
    return lum;
}
