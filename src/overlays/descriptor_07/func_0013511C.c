#include "game/dialog134.h"
extern s32 D_801F0B40;
void func_0013511C(Dialog134 *d);
s32 D_8017B550(u8 c);
u8 D_801793E4(u8 c, s32 a);
extern inline s32 TextLen134(u8 *s, s32 *w) {
    s32 n = 0;
    while (*s != 0) {
        s32 c = D_801793E4(*s, 0);
        if (c == 0xB) {
            s++;
            n += 2;
        } else {
            n++;
        }
        s++;
        *w += c;
    }
    return n;
}
extern u8 *D_801ED290[];
extern struct { s32 y; } D_801F0B48;
void func_0013511C(Dialog134 *d) {
    s32 w0;
    s32 w1;
    s32 w2;
    s32 top;
    u8 *t;
    s32 alt;
    s32 max;
    s32 cur;
    s32 lines;
    s32 x;
    s32 y;
    s32 h;
    s32 right;
    s32 bottom;
    w2 = 0;
    w1 = 0;
    w0 = 0;
    top = d->x2;
    if (d->a != 0) {
        d->lenA = TextLen134((u8 *)d->a, &w0);
    }
    if (d->b != 0) {
        d->lenB = TextLen134((u8 *)d->b, &w1);
    }
    if (d->c != 0) {
        d->lenC = TextLen134((u8 *)d->c, &w2);
    }
    t = D_801ED290[d->id];
    alt = 0;
    max = 0;
    cur = 0;
    lines = 1;
    while (*t != 0) {
        if (D_8017B550(*t)) {
            u16 c = t[1] | (t[0] << 8);
            if (c == 0x8197) {
                lines++;
                if (max < cur) {
                    max = cur;
                }
                cur = 0;
            } else if (c == 0x8194) {
                cur += w0;
            } else if (c == 0x8190) {
                cur += w1;
            } else if (c == 0x8193) {
                cur += w2;
            } else {
                cur += 0xB;
            }
            t++;
        } else if (*t == 0xE) {
            alt = 1;
        } else if (*t == 0xF) {
            alt = 0;
        } else {
            cur += D_801793E4(*t, alt);
        }
        t++;
    }
    if (max < cur) {
        max = cur;
    }
    d->unk04 = max;
    d->lines = lines;
    d->text = D_801ED290[d->id];
    x = (320 - max) / 2;
    h = lines * 15;
    y = (240 - h) / 2;
    right = 320 - x;
    bottom = 0xEE - y;
    if (D_801F0B40 == 0) {
        d->y2 = y + 0x21;
        d->x2 = x - 4;
        d->w2 = right + 4;
        d->h2 = bottom + 0x25;
        d->x = 0x9C;
        d->w = 0xA4;
        d->y = d->y2;
        d->h = d->y + 4;
    } else {
        d->x2 = x - 4;
        d->w2 = right + 4;
        d->y2 = D_801F0B48.y;
        d->h2 = d->y2 + h + 2;
        d->x = (d->x2 + d->w2) / 2 - 4;
        d->w = (d->x2 + d->w2) / 2 + 4;
        d->y = d->y2;
        d->h = d->y2 + 4;
    }
    d->h2 += 3;
    if (top != -1) {
        s32 old = d->y2;
        d->y2 = top;
        d->h2 = top + (d->h2 - old);
        d->y = d->y2;
        d->h = d->y + 4;
    }
}
