typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void *func_00001330(s32 size);
void *func_000016C4(void *ptr);
void bcopy(void *src, void *dst, s32 n);
u8 *func_0006e8d4(u8 *desc, u32 index);
u8 *func_0006e8d4(u8 *t, u32 page);
u8 *D_80197F08(u8 *desc, u32 index);
u8 *func_0006eaa4(u8 *desc, u32 index);
u8 *func_0006eb9c(u8 *t, u32 index) {
    u8 f = t[3];
    u32 w = *(u16 *)(t + 4);
    u32 h = *(u16 *)(t + 6);
    s32 pitch;
    s32 subPitch;
    s32 texBytes;
    s32 subBytes;
    s32 size;
    u8 *e;
    s32 dsize;
    u8 *out;
    u8 *base;
    u8 *hdr;
    u8 g;
    u32 x;
    u32 y;
    u16 half;
    if (f & 2) {
        pitch = ((u32)(w + 3) >> 2) * 16;
        subPitch = 0;
    } else if (f & 4) {
        pitch = ((u32)(w + 7) >> 3) * 8;
        if (f & 1) {
            subPitch = ((u32)(w + 15) >> 4) * 8;
        } else {
            subPitch = pitch;
        }
    } else {
        pitch = ((u32)(w + 3) >> 2) * 8;
        if (f & 1) {
            subPitch = ((u32)(w + 15) >> 4) * 8;
        } else {
            subPitch = ((u32)(w + 7) >> 3) * 8;
        }
    }
    texBytes = pitch * h;
    e = func_0006e8d4(t, index);
    subBytes = subPitch * h;
    if (index == e[2]) {
        g = e[3];
        size = 0x10;
        if (g & 1) {
            size = texBytes + 0x10;
        }
        if (g & 2) {
            size += subBytes;
        }
        if (g & 4) {
            size += 0x200;
        }
        out = func_00001330(size);
        bcopy(t, out, 8);
        out[2] = 1;
        bcopy(e, out + 8, size - 8);
        out[10] = 0;
        return out;
    }
    base = func_0006eb9c(t, e[2]);
    g = e[3];
    dsize = 0x10;
    if (g & 1) {
        dsize = texBytes + 0x10;
    }
    if (g & 2) {
        dsize += subBytes;
    }
    if (g & 4) {
        dsize += 0x200;
    }
    out = func_00001330(dsize);
    bcopy(t, out, 8);
    hdr = out + 8;
    out[2] = 1;
    bcopy(e, hdr, 8);
    out[10] = 0;
    f = t[3];
    if (f & 2) {
        u8 *src;
        u8 *prev;
        u8 *dst;
        { u8 *_e = func_0006e8d4(t, index); if (_e == ((void *)0)) { src = ((void *)0); } else { src = ((void *)0); if (_e[3] & 1) { src = _e + 8; } } };
        { u8 *_e = func_0006e8d4(base, 0); if (_e == ((void *)0)) { prev = ((void *)0); } else { prev = ((void *)0); if (_e[3] & 1) { prev = _e + 8; } } };
        { u8 *_e = func_0006e8d4(out, 0); if (_e == ((void *)0)) { dst = ((void *)0); } else { dst = ((void *)0); if (_e[3] & 1) { dst = _e + 8; } } };
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                ((u32 *)dst)[x] = ((u32 *)prev)[x] ^ ((u32 *)src)[x];
            }
            dst += pitch;
            prev += pitch;
            src += pitch;
        }
    } else if (f & 4) {
        u8 *src;
        u8 *ssrc;
        u8 *prev;
        u8 *sprev;
        u8 *dst;
        u8 *sdst;
        { u8 *_e = func_0006e8d4(t, index); if (_e == ((void *)0)) { src = ((void *)0); } else { src = ((void *)0); if (_e[3] & 1) { src = _e + 8; } } };
        ssrc = D_80197F08(t, index);
        { u8 *_e = func_0006e8d4(base, 0); if (_e == ((void *)0)) { prev = ((void *)0); } else { prev = ((void *)0); if (_e[3] & 1) { prev = _e + 8; } } };
        sprev = D_80197F08(base, 0);
        { u8 *_e = func_0006e8d4(out, 0); if (_e == ((void *)0)) { dst = ((void *)0); } else { dst = ((void *)0); if (_e[3] & 1) { dst = _e + 8; } } };
        sdst = D_80197F08(out, 0);
        g = hdr[3];
        if (g & 1) {
            if (g & 8) {
                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        dst[x] = src[x];
                    }
                    dst += pitch;
                    src += pitch;
                }
            } else {
                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        dst[x] = prev[x] - src[x];
                    }
                    dst += pitch;
                    prev += pitch;
                    src += pitch;
                }
            }
        }
        if (hdr[3] & 2) {
            if (t[3] & 1) {
                half = (w + 1) >> 1;
                for (y = 0; y < h; y++) {
                    for (x = 0; x < half; x++) {
                        u8 hi = ((sprev[x] & 0xF0) - (ssrc[x] & 0xF0)) & ~0xF;
                        u8 lo = ((sprev[x] & 0xF) - (ssrc[x] & 0xF)) & 0xF;
                        sdst[x] = lo | hi;
                    }
                    sdst += subPitch;
                    sprev += subPitch;
                    ssrc += subPitch;
                }
            } else {
                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        sdst[x] = sprev[x] - ssrc[x];
                    }
                    sdst += subPitch;
                    sprev += subPitch;
                    ssrc += subPitch;
                }
            }
        }
        if (hdr[3] & 4) {
            bcopy(func_0006eaa4(t, index), func_0006eaa4(out, 0), 0x200);
        }
    } else if (!(f & 6)) {
        u8 *src;
        u8 *ssrc;
        u8 *prev;
        u8 *sprev;
        u8 *dst;
        u8 *sdst;
        { u8 *_e = func_0006e8d4(t, index); if (_e == ((void *)0)) { src = ((void *)0); } else { src = ((void *)0); if (_e[3] & 1) { src = _e + 8; } } };
        ssrc = D_80197F08(t, index);
        { u8 *_e = func_0006e8d4(base, 0); if (_e == ((void *)0)) { prev = ((void *)0); } else { prev = ((void *)0); if (_e[3] & 1) { prev = _e + 8; } } };
        sprev = D_80197F08(base, 0);
        { u8 *_e = func_0006e8d4(out, 0); if (_e == ((void *)0)) { dst = ((void *)0); } else { dst = ((void *)0); if (_e[3] & 1) { dst = _e + 8; } } };
        sdst = D_80197F08(out, 0);
        g = hdr[3];
        if (g & 1) {
            if (g & 8) {
                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        ((u16 *)dst)[x] = ((u16 *)src)[x];
                    }
                    dst += pitch;
                    src += pitch;
                }
            } else {
                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        ((u16 *)dst)[x] = ((u16 *)prev)[x] - ((u16 *)src)[x];
                    }
                    dst += pitch;
                    src += pitch;
                    prev += pitch;
                }
            }
        }
        if (hdr[3] & 2) {
            if (t[3] & 1) {
                half = (w + 1) >> 1;
                for (y = 0; y < h; y++) {
                    for (x = 0; x < half; x++) {
                        u8 hi = ((sprev[x] & 0xF0) - (ssrc[x] & 0xF0)) & ~0xF;
                        u8 lo = ((sprev[x] & 0xF) - (ssrc[x] & 0xF)) & 0xF;
                        sdst[x] = lo | hi;
                    }
                    sdst += subPitch;
                    sprev += subPitch;
                    ssrc += subPitch;
                }
            } else {
                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        sdst[x] = sprev[x] - ssrc[x];
                    }
                    sdst += subPitch;
                    sprev += subPitch;
                    ssrc += subPitch;
                }
            }
        }
    }
    func_000016C4(base);
    return out;
}
