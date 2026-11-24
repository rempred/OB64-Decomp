typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    s32 id;
    s32 unk04;
    s32 lines;
    s32 x2;
    s32 y2;
    s32 w2;
    s32 h2;
    s32 x;
    s32 y;
    s32 w;
    s32 h;
    u8 *win;
    u8 *win2;
    u8 *text;
    s32 a;
    s32 b;
    s32 c;
    signed char *opt0;
    signed char *opt1;
    s32 lenA;
    s32 lenB;
    s32 lenC;
    s32 len0;
    s32 len1;
    u8 sel;
    u8 d;
} Dialog134;
extern Dialog134 D_801ED540;
void func_00134CD4(u8 *o, s32 i);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
void bcopy(void *src, void *dst, s32 n);
void bzero(void *p, s32 n);
void D_80179034(signed char *s, s32 x, s32 y);
void D_8017C4B4(s16 a);
extern Gfx *gTitleCardDisplayListCursor;
s32 D_8017B550(u8 c);
void D_80201384(s32 a, s32 b, s32 c, s32 d);
void D_8020D780(s32 x, s32 y);
void D_8020DAA8(s32 x, s32 y);
typedef struct { u8 pad[0x18]; s16 page; } Page134;
void func_00134CD4(u8 *o, s32 i) {
    Dialog134 *s = &D_801ED540;
    Page134 *p = (Page134 *)(i * 2 + (s32)o);
    if (p->page != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        s32 line;
        s32 n;
        s32 ty;
        u8 *t;
        u8 *start;
        signed char *dst;
        signed char buf[0x100];
        gTitleCardDisplayListCursor->w0 = 0xE7000000;
        gTitleCardDisplayListCursor->w1 = 0;
        gTitleCardDisplayListCursor++;
        line = 0;
        D_8017C4B4(p->page);
        t = s->text;
        ty = y + 4;
        for (start = t; line < s->lines; line++) {
            bzero(buf, 0x100);
            dst = buf;
            n = 0;
            while (1) {
                if (D_8017B550(*t)) {
                    s32 c = t[1] | (t[0] << 8);
                    if (c == 0x8197) {
                        bcopy(start, dst, n);
                        t += 2;
                        break;
                    }
                    if (c == 0x8194) {
                        bcopy(start, dst, n);
                        start += n + 2;
                        dst += n;
                        bcopy((void *)s->a, dst, s->lenA);
                        dst += s->lenA;
                        n = 0;
                        t++;
                    } else if (c == 0x8190) {
                        bcopy(start, dst, n);
                        start += n + 2;
                        dst += n;
                        bcopy((void *)s->b, dst, s->lenB);
                        dst += s->lenB;
                        n = 0;
                        t++;
                    } else if (c == 0x8193) {
                        bcopy(start, dst, n);
                        start += n + 2;
                        dst += n;
                        bcopy((void *)s->c, dst, s->lenC);
                        dst += s->lenC;
                        n = 0;
                        t++;
                    } else {
                        n += 2;
                        t++;
                    }
                } else if (*t == 0) {
                    bcopy(start, dst, n);
                    break;
                } else {
                    n++;
                }
                t++;
            }
            D_80179034(buf, s->x2 + 4, ty);
            ty += 15;
            start = t;
        }
        if (s->d != 0) {
            D_80201384((*(s32 *)((u8 *)(o) + (0x7C))), (*(s32 *)((u8 *)(o) + (0x80))) - 12, (*(s32 *)((u8 *)(o) + (0x84))), (*(s32 *)((u8 *)(o) + (0x88))));
            gTitleCardDisplayListCursor->w0 = 0xE3001001;
            gTitleCardDisplayListCursor->w1 = 0x8000;
            gTitleCardDisplayListCursor++;
            if (s->d == 1) {
                D_8020D780(x + 6, y - 10);
            } else if (s->d == 2) {
                D_8020DAA8(x + 6, y - 10);
            }
        }
    }
}
