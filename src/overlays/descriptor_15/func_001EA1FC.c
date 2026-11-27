typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_801BA6B8;
s32 func_001EA1FC(s32 k, s32 j, s32 *a, s32 *b, s32 *c, s32 *d, s32 *e, s32 *f, s32 *g, s32 *h) {
    s16 *t;
    t = (s16 *)(D_801BA6B8 + ((s16 *)D_801BA6B8)[k]);
    t += j * 13;
    if (t[0] != -1) {
        if (a != ((void *)0)) {
            *a = t[1];
        }
        if (b != ((void *)0)) {
            *b = t[2];
        }
        if (c != ((void *)0)) {
            *c = t[3];
        }
        if (d != ((void *)0)) {
            if ((u16)t[4] == 0x8000) {
                *d = 0x80000000;
            } else {
                *d = t[4];
            }
        }
        if (e != ((void *)0)) {
            *e = t[5];
        }
        if (f != ((void *)0)) {
            *f = t[6];
        }
        if (g != ((void *)0)) {
            *g = t[7];
        }
        if (h != ((void *)0)) {
            *h = t[8];
        }
    }
    return t[0];
}
