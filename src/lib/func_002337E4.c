#include "game/battle_roster_record.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

s32 func_0002CBCC(void);
s32 D_801C8C3C(void *u);
s32 D_801C8E30(void *u);
s32 func_002337E4(BattleRosterRecord **out, s32 start, s32 lane);
void *D_801CA2E0(unsigned int lane, s32 row);
s32 func_002337E4(BattleRosterRecord **out, s32 start, s32 lane) {
    BattleRosterRecord **p;
    BattleRosterRecord *c;
    BattleRosterRecord *r;
    BattleRosterRecord *l;
    s32 n;
    s32 row;
    s32 far;
    n = 0;
    l = ((void *)0);
    r = ((void *)0);
    c = ((void *)0);
    row = start;
    p = out;
    for (;;) {
        if (c == ((void *)0)) {
            c = D_801CA2E0(lane, row);
            if (D_801C8E30(c) || D_801C8C3C(c)) {
                c = ((void *)0);
            }
            if (c != ((void *)0)) {
                *p++ = c;
                n++;
            }
        }
        if (r == ((void *)0) && l == ((void *)0)) {
            r = D_801CA2E0(lane + 1, row);
            l = D_801CA2E0(lane - 1, row);
            if (D_801C8E30(r) || D_801C8C3C(r)) {
                r = ((void *)0);
            }
            if (D_801C8E30(l) || D_801C8C3C(l)) {
                l = ((void *)0);
            }
            if (r != ((void *)0) && l != ((void *)0)) {
                if (func_0002CBCC() & 1) {
                    *p++ = r;
                    *p++ = l;
                } else {
                    *p++ = l;
                    *p++ = r;
                }
                n += 2;
            } else if (r != ((void *)0)) {
                *p++ = r;
                n++;
            } else if (l != ((void *)0)) {
                *p++ = l;
                n++;
            }
        } else if (r == ((void *)0)) {
            r = D_801CA2E0(lane + 1, row);
            if (D_801C8E30(r) || D_801C8C3C(r)) {
                r = ((void *)0);
            }
            if (r != ((void *)0)) {
                *p++ = r;
                n++;
            }
        } else if (l == ((void *)0)) {
            l = D_801CA2E0(lane - 1, row);
            if (D_801C8E30(l) || D_801C8C3C(l)) {
                l = ((void *)0);
            }
            if (l != ((void *)0)) {
                *p++ = l;
                n++;
            }
        }
        if (c != ((void *)0) && r != ((void *)0) && l != ((void *)0)) {
            break;
        }
        if (start == 0) {
            if (++row >= 3) {
                break;
            }
        } else if (start == 2) {
            if (--row < 0) {
                break;
            }
        } else if (start == 6) {
            if (++row >= 9) {
                break;
            }
        } else if (--row < 6) {
            break;
        }
    }
    if (n == 0 && lane != 1) {
        far = lane == 0 ? 2 : 0;
        row = start;
        for (;;) {
            c = D_801CA2E0(far, row);
            if (D_801C8E30(c) || D_801C8C3C(c)) {
                c = ((void *)0);
            }
            if (c != ((void *)0)) {
                out[n] = c;
                n++;
                break;
            }
            if (start == 0) {
                if (++row >= 3) {
                    break;
                }
            } else if (start == 2) {
                if (--row < 0) {
                    break;
                }
            } else if (start == 6) {
                if (++row >= 9) {
                    break;
                }
            } else if (--row < 6) {
                break;
            }
        }
    }
    return n;
}
