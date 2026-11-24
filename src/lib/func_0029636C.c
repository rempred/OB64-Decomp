void bcopy(void *src, void *dst, int n);
#include "game/cutscene_panels.h"
void *func_00001330(unsigned int);
void *func_000016C4(void *ptr);

void bzero(void *p, s32 n);
u8 *D_80227A18(s32 id, s32 n);
void bzero(void *p, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
void bzero(void *p, s32 n);
u8 func_00295E20(s32 a, u8 *p, s32 b);
s32 func_0028abfc();
PanelContent *func_0029636C(Panel *o, s32 mode) {
    u8 buf[0x500];
    u8 *bp;
    u8 *t;
    u8 *e;
    u16 n;
    u8 *msg;
    s32 start;
    s32 k;
    s32 i;
    {
        u8 *w = func_00001330(0x604);
        (*(u8 * *)((u8 *)(o) + (0xD0))) = w;
        bzero(w, 0x604);
    }
    bzero(buf, 0x500);
    t = (*(u8 * *)((u8 *)(o) + (0xD0)));
    t[0x5F3] = 0x3F;
    t[0x5F6] = 0x11;
    t[0x5F0] = 0;
    t[0x5FE] = 2;
    {
        u8 *d = (u8 *)D_8023DE30;
        (*(s32 *)((u8 *)(t) + (0x600))) = mode;
        e = ((u8 **)d)[d[0x23D]];
    }
    bp = buf;
    start = 0;
    n = func_0028abfc(e[0x2D]) & 0xFF;
    msg = D_80227A18(0x018855FE, 2);
    k = 0;
    for (i = 0; i < 0x0FFFFFFF; i++) {
        if (msg[i] == '\r' && msg[i + 1] == '\n' && msg[i + 2] == '\r' && msg[i + 3] == '\n') {
            k++;
            if (n == k) {
                s32 len = i - start;
                bzero(bp, len + 2);
                memcpy_aligned(bp, msg + start, len);
                break;
            }
            start = i + 4;
        }
    }
    func_000016C4(msg);
    bcopy((s32 *)buf, t, 0x500);
    o->field25 = 1;
    t[0x5F4] = 1;
    t[0x5F5] = func_00295E20(1, t, (*(s16 *)((u8 *)(e) + (0x2C))));
    return (PanelContent *)t;
}
