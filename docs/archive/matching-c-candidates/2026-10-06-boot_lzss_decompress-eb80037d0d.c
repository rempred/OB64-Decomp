/* A510 diagnostic: a working destination parameter avoids the postguard parameter-to-local cursor copy. Return values of the inline copy helper are unused. */
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

static inline void lz_copy(u8 *d, const u8 *s, u32 n)
{
    u32 words;

    if (n == 0) {
        return;
    }
    if (((s - d) & 3) != 0) {
        while (n--) {
            *d++ = *s++;
        }
        return;
    }
    if ((u32)d & 1) {
        *d++ = *s++;
        n--;
    }
    if (n >= 2 && ((u32)d & 2)) {
        *(u16 *)d = *(const u16 *)s;
        d += 2;
        s += 2;
        n -= 2;
    }
    for (words = n >> 2; words--;) {
        *(u32 *)d = *(const u32 *)s;
        d += 4;
        s += 4;
    }
    if (n & 2) {
        *(u16 *)d = *(const u16 *)s;
        d += 2;
        s += 2;
    }
    if (n & 1) {
        *d = *s;
    }
    return;
}

/* Literal runs retain the base argument until the zero-length guard. */
static inline void *lz_copy_late(void *dst, const void *src, u32 n)
{
    u8 *d;
    const u8 *s = src;
    u32 words;

    if (n == 0) {
        return dst;
    }
    d = dst;
    if (((s - d) & 3) != 0) {
        while (n--) {
            *d++ = *s++;
        }
        return dst;
    }
    if ((u32)d & 1) {
        *d++ = *s++;
        n--;
    }
    if (n >= 2 && ((u32)d & 2)) {
        *(u16 *)d = *(const u16 *)s;
        d += 2;
        s += 2;
        n -= 2;
    }
    for (words = n >> 2; words--;) {
        *(u32 *)d = *(const u32 *)s;
        d += 4;
        s += 4;
    }
    if (n & 2) {
        *(u16 *)d = *(const u16 *)s;
        d += 2;
        s += 2;
    }
    if (n & 1) {
        *d = *s;
    }
    return dst;
}

static inline void *lz_fill(void *dst, u32 value, u32 n)
{
    u8 *d;
    u32 words;

    if (n == 0) {
        return dst;
    }
    value &= 0xFF;
    value |= value << 8;
    value |= value << 16;
    d = dst;
    if ((u32)d & 1) {
        *d++ = value;
        n--;
    }
    if (n >= 2 && ((u32)d & 2)) {
        *(u16 *)d = value;
        d += 2;
        n -= 2;
    }
    for (words = n >> 2; words--;) {
        *(u32 *)d = value;
        d += 4;
    }
    if (n & 2) {
        *(u16 *)d = value;
        d += 2;
    }
    if (n & 1) {
        *d = value;
    }
    return dst;
}

u32 func_0000ABE0(const u8 *p);

/* Decode a size-prefixed LZ stream into dst; returns the decoded size. */
u32 boot_lzss_decompress(u8 *dst, const u8 *src)
{
    u32 size;
    u32 pos;
    u8 code;
    u32 hi;
    u32 lo;

    size = func_0000ABE0(src);
    src += 4;
    for (pos = 0; pos < size;) {
        code = *src++;
        if (code & 0x80) {
            /* short back-reference: 4-bit length, 11-bit distance */
            u8 *out;
            u32 n = ((code >> 3) & 0xF) + 3;
            u32 remaining = n;
            u32 low = *src++;
            const u8 *from;
            u32 words;

            out = dst + pos;
            from = out - ((code & 7) << 8) - low - 1;

            /* Work on the caller cursor directly. A callee parameter introduces
             * a distinct cursor lifetime in the pinned compiler. */
            if (remaining != 0) {
                if (((from - out) & 3) != 0) {
                    while (remaining--) {
                        *out++ = *from++;
                    }
                } else {
                    if ((u32)out & 1) {
                        *out++ = *from++;
                        remaining--;
                    }
                    if (remaining >= 2 && ((u32)out & 2)) {
                        *(u16 *)out = *(const u16 *)from;
                        out += 2;
                        from += 2;
                        remaining -= 2;
                    }
                    for (words = remaining >> 2; words--;) {
                        *(u32 *)out = *(const u32 *)from;
                        out += 4;
                        from += 4;
                    }
                    if (remaining & 2) {
                        *(u16 *)out = *(const u16 *)from;
                        out += 2;
                        from += 2;
                    }
                    if (remaining & 1) {
                        *out = *from;
                    }
                }
            }
            pos += n;
        } else if (code & 0x40) {
            /* literal run */
            const u8 *from = src;
            u32 n = (code & 0x3F) + 1;
            u32 remaining = n;
            u8 *base = dst + pos;
            u8 *out;
            u32 words;
            if (remaining != 0) {
                out = base;
                if (((from - out) & 3) != 0) {
                    while (remaining--) {
                        *out++ = *from++;
                    }
                } else {
                    if ((u32)out & 1) {
                        *out++ = *from++;
                        remaining--;
                    }
                    if (remaining >= 2 && ((u32)out & 2)) {
                        *(u16 *)out = *(const u16 *)from;
                        out += 2;
                        from += 2;
                        remaining -= 2;
                    }
                    for (words = remaining >> 2; words--;) {
                        *(u32 *)out = *(const u32 *)from;
                        out += 4;
                        from += 4;
                    }
                    if (remaining & 2) {
                        *(u16 *)out = *(const u16 *)from;
                        out += 2;
                        from += 2;
                    }
                    if (remaining & 1) {
                        *out = *from;
                    }
                }
            }
            pos += n;
            src += n;
        } else if (code & 0x20) {
            /* short zero run */
            u32 n = (code & 0x1F) + 2;
            u32 remaining = n;
            u8 *base = dst + pos;
            u8 *out;
            u32 words;
            u32 value;
            if (remaining != 0) {
                out = base;
                value = 0;
                if ((u32)out & 1) {
                    *out++ = 0;
                    remaining--;
                }
                if (remaining >= 2 && ((u32)out & 2)) {
                    *(u16 *)out = 0;
                    out += 2;
                    remaining -= 2;
                }
                for (words = remaining >> 2; words--;) {
                    *(u32 *)out = value;
                    out += 4;
                }
                if (remaining & 2) {
                    *(u16 *)out = 0;
                    out += 2;
                }
                if (remaining & 1) {
                    *out = value;
                }
            }
            pos += n;
        } else if (code & 0x10) {
            /* medium back-reference: 6-bit length, 14-bit distance */
            u32 n;
            u8 *base = dst + pos;
            u8 *out;
            const u8 *from;
            u32 remaining;
            u32 words;
            u32 high = *src++;
            u32 low = *src++;
            from = base - (((high & 0x3F) << 8) | low) - 1;
            n = ((code & 0xF) | ((high >> 2) & 0x30)) + 4;
            remaining = n;
            if (remaining != 0) {
                out = base;
                if (((from - out) & 3) != 0) {
                    while (remaining--) {
                        *out++ = *from++;
                    }
                } else {
                    if ((u32)out & 1) {
                        *out++ = *from++;
                        remaining--;
                    }
                    if (remaining >= 2 && ((u32)out & 2)) {
                        *(u16 *)out = *(const u16 *)from;
                        out += 2;
                        from += 2;
                        remaining -= 2;
                    }
                    for (words = remaining >> 2; words--;) {
                        *(u32 *)out = *(const u32 *)from;
                        out += 4;
                        from += 4;
                    }
                    if (remaining & 2) {
                        *(u16 *)out = *(const u16 *)from;
                        out += 2;
                        from += 2;
                    }
                    if (remaining & 1) {
                        *out = *from;
                    }
                }
            }
            pos += n;
        } else {
            switch (code) {
            case 0: {
                /* long back-reference: 8-bit length, 16-bit distance */
                u8 *out = dst + pos;
                u32 n = *src++ + 5;
                u32 high = *src++;
                u32 low = *src++;
                const u8 *from = out - ((high << 8) | low) - 1;
                u32 remaining = n;
                u32 words;
                if (remaining != 0) {
                    if (((from - out) & 3) != 0) {
                        while (remaining--) {
                            *out++ = *from++;
                        }
                    } else {
                        if ((u32)out & 1) {
                            *out++ = *from++;
                            remaining--;
                        }
                        if (remaining >= 2 && ((u32)out & 2)) {
                            *(u16 *)out = *(const u16 *)from;
                            out += 2;
                            from += 2;
                            remaining -= 2;
                        }
                        for (words = remaining >> 2; words--;) {
                            *(u32 *)out = *(const u32 *)from;
                            out += 4;
                            from += 4;
                        }
                        if (remaining & 2) {
                            *(u16 *)out = *(const u16 *)from;
                            out += 2;
                            from += 2;
                        }
                        if (remaining & 1) {
                            *out = *from;
                        }
                    }
                }
                pos += n;
                break;
            }
            case 1: {
                u8 *base = dst + pos;
                u32 n = *src++ + 3;
                u32 remaining = n;
                u8 *out;
                u32 words;
                u32 value;
                if (remaining != 0) {
                    out = base;
                    value = 0xFFFFFFFF;
                    if ((u32)out & 1) {
                        *(signed char *)out++ = -1;
                        remaining--;
                    }
                    if (remaining >= 2 && ((u32)out & 2)) {
                        *(short *)out = -1;
                        out += 2;
                        remaining -= 2;
                    }
                    for (words = remaining >> 2; words--;) {
                        *(u32 *)out = value;
                        out += 4;
                    }
                    if (remaining & 2) {
                        *(u16 *)out = value;
                        out += 2;
                    }
                    if (remaining & 1) {
                        *out = value;
                    }
                }
                pos += n;
                break;
            }
            case 2: {
                u8 *base = dst + pos;
                u32 n = *src++ + 3;
                u32 remaining = n;
                u8 *out;
                u32 words;
                u32 value;
                if (remaining != 0) {
                    out = base;
                    value = 0;
                    if ((u32)out & 1) {
                        *out++ = 0;
                        remaining--;
                    }
                    if (remaining >= 2 && ((u32)out & 2)) {
                        *(u16 *)out = 0;
                        out += 2;
                        remaining -= 2;
                    }
                    for (words = remaining >> 2; words--;) {
                        *(u32 *)out = value;
                        out += 4;
                    }
                    if (remaining & 2) {
                        *(u16 *)out = 0;
                        out += 2;
                    }
                    if (remaining & 1) {
                        *out = value;
                    }
                }
                pos += n;
                break;
            }
            default:
                break;
            }
        }
    }
    return size;
}


u32 func_0000ABE0(const u8 *p) { return (p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]; }
u32 func_0000AC0C(u8 *out, u8 **archive, int index)
{
    u8 *dst;
    u8 *dict;
    u8 *in;
    u32 pos;
    u32 size;
    u16 mask;
    u8 mode;
    int bits;
    int shift;
    u16 flags;
    u8 code;
    u8 n;
    u8 refs;
    u32 len;
    u32 off;

    dict = archive[0];
    in = archive[1 + index];
    dst = out;
    pos = 0;
    mask = 0xFFFF;
    mode = dict[0];
    bits = dict[1];
    if (mode < 2 || mode == 2) {
        size = (dict[2] << 8) + dict[3];
        dict += 4;
    } else {
        dict += 2;
        size = (in[0] << 8) + in[1];
        in += 2;
    }
    if (mode == 0 || mode == 3) {
        mask = mask >> (bits + 1);
    } else {
        mask = mask >> bits;
    }
    if (mode == 0 || mode == 3) {
        if (pos == size) {
            return size;
        }
        bits = 8 - bits;
        do {
            code = *in;
            if (code & 0x80) {
                u32 literal = (code & 0x7F) + 1;
                pos += literal;
                in++;
                while (literal-- > 0) {
                    *dst++ = *in++;
                }
            } else {
                len = (u32)(code << 1) >> bits;
                len += 3;
                pos += len;
                off = ((code << 8) + in[1]) & mask;
                while (len-- > 0) {
                    *dst++ = dict[off++];
                }
                in += 2;
            }
        } while (pos != size);
    } else if (mode == 1 || mode == 4) {
        flags = 0;
        if (pos == size) {
            return size;
        }
        shift = 8 - bits;
        do {
            flags <<= 1;
            if ((flags & 0xFE) == 0) {
                flags = (*in++ << 8) | 0xFF;
            }
            if (flags & 0x8000) {
                *dst++ = *in++;
                pos++;
            } else {
                len = (in[0] >> shift) + 3;
                off = (in[0] << 8) + in[1];
                off &= mask;
                pos += len;
                while (len-- > 0) {
                    *dst++ = dict[off++];
                }
                in += 2;
            }
        } while (pos != size);
    } else {
        if (pos == size) {
            return size;
        }
        shift = 8 - bits;
        while (pos != size) {
            code = *in;
            n = code >> 3;
            if (code == 0) {
                break;
            }
            refs = code & 7;
            in++;
            pos += n;
            while (n--) {
                *dst++ = *in++;
            }
            while (refs--) {
                len = (in[0] >> shift) + 3;
                off = (in[0] << 8) + in[1];
                off &= mask;
                pos += len;
                while (len-- > 0) {
                    *dst++ = dict[off++];
                }
                in += 2;
            }
        }
    }
    return size;
}

u32 func_0000AF30(u8 **archive, int index)
{
    const u8 *header;
    const u8 *entry;
    u32 mode;
    header = archive[0];
    mode = header[0];
    entry = archive[1 + index];
    if (mode < 2)
        goto header_size;
    if (mode != 2)
        goto entry_size;
header_size:
    return (header[2] << 8) | header[3];
entry_size:
    return (entry[0] << 8) | entry[1];
}
