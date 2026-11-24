typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern inline s32 RowBytes201(s32 fmt, u32 w) {
    if (fmt == 3) {
        return ((u32)(w + 3) >> 2) * 16;
    }
    if (fmt == 2) {
        return ((u32)(w + 3) >> 2) * 8;
    }
    if (fmt == 1) {
        return ((u32)(w + 7) >> 3) * 8;
    }
    if (fmt == 0) {
        return ((u32)(w + 15) >> 4) * 8;
    }
    return ((u32)(w + 31) >> 5) * 8;
}
u32 func_00202A2C(u8 *img, u8 *pal, u32 fmt, u32 siz, u32 w, u32 h, u32 x, u32 y) {
    u32 off = RowBytes201(siz, w) * y;
    u32 r = 0;
    u32 v;
    switch (fmt) {
        case 0:
            switch (siz) {
                case 2:
                    {
                        u16 c = *(u16 *)(img + (x * 2 + off));
                        r = ((c & 0xF800) << 16) | ((c & 0x7C0) << 13) | ((c & 0x3E) << 10);
                        if (c & 1) {
                            r |= 0xFF;
                        }
                    }
                    break;
                case 3:
                    r = *(u32 *)(img + (x * 4 + off));
                    break;
            }
            break;
        case 2:
            switch (siz) {
                case 0:
                    v = img[off + x / 2];
                    if (x & 1) {
                        v &= 0xF;
                    } else {
                        v >>= 4;
                    }
                    {
                        u16 c = *(u16 *)(pal + v * 2);
                        r = ((c & 0xF800) << 16) | ((c & 0x7C0) << 13) | ((c & 0x3E) << 10);
                        if (c & 1) {
                            r |= 0xFF;
                        }
                    }
                    break;
                case 1:
                    {
                        u16 c = *(u16 *)(pal + img[off + x] * 2);
                        r = ((c & 0xF800) << 16) | ((c & 0x7C0) << 13) | ((c & 0x3E) << 10);
                        if (c & 1) {
                            r |= 0xFF;
                        }
                    }
                    break;
            }
            break;
        case 3:
            switch (siz) {
                case 0:
                    v = img[off + x / 2];
                    if (x & 1) {
                        v &= 0xF;
                    } else {
                        v >>= 4;
                    }
                    r = (v & 0xE) << 28 | (v & 0xE) << 20 | (v & 0xE) << 12;
                    if (v & 1) {
                        r |= 0xFF;
                    }
                    break;
                case 1:
                    {
                        u32 c = img[off + x];
                        r = (c & 0xF0) << 24 | (c & 0xF0) << 16 | (c & 0xF0) << 8 | c << 4;
                    }
                    break;
                case 2:
                    {
                        u32 c = *(u16 *)(img + (x * 2 + off));
                        r = (c & 0xFF00) << 16 | (c & 0xFF00) << 8 | (c & 0xFF00) | (c & 0xFF);
                    }
                    break;
            }
            break;
        case 4:
            switch (siz) {
                case 0:
                    v = img[off + x / 2];
                    if (x & 1) {
                        v &= 0xF;
                    } else {
                        v >>= 4;
                    }
                    r = (v & 0xF) << 28 | (v & 0xF) << 20 | (v & 0xF) << 12 | (v & 0xF) << 4;
                    break;
                case 1:
                    {
                        u32 c = img[off + x];
                        r = c << 24 | c << 16 | c << 8 | c;
                    }
                    break;
            }
            break;
    }
    return r;
}
u32 func_00202A2C(u8 *img, u8 *pal, u32 fmt, u32 siz, u32 w, u32 h, u32 x, u32 y);
