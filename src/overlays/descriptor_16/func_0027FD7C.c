#include "game/task27_object.h"
#include "game/sound_channel_services.h"

int func_0027F778(void *record);
typedef struct Task27 {
    u8 unk00[4];
    u16 state;
    u16 next;
    s32 (*fn)(u16, struct Task27 *);
    s16 hC;
    s16 hE;
    s16 h10;
    u8 unk12[0x26];
} Task27;
typedef struct {
    u8 unk00[0x4C];
    s32 w4C;
} Unit27;
extern Unit27 *D_8022D134[];
s32 func_0027FD7C(u16 msg, Task27 *t);
void func_0027CF50(Task27 *t);
extern u8 D_800EB1F0[];
s32 func_0027E8B0(void *o);
extern s16 D_8022CB28;
void D_8017C384(struct Panel *);
typedef struct {
    s16 x0;
    s16 y0;
    s16 x1;
    s16 y1;
} Rect27;
extern Rect27 D_8022D098;
extern Rect27 D_8022D0A0;
extern u8 D_8022CB84[];
void D_80184130(void *w);
void func_002803C0(Panel *panel, int selector);
Panel *D_8017F334(u16 id);
extern inline void Win27_MoveTo(Panel *w, s16 *r) {
    if (w == ((void *)0) || r == ((void *)0)) {
        return;
    }
    w->field1E = 8;
    w->field26 |= 1;
    w->field3C = r[0];
    w->field40 = r[1];
    w->field44 = r[2];
    w->field48 = r[3];
    D_80184130(w);
}
extern inline void Win27_SetRect4C(Panel *w, Rect27 *r) {
    w->field4C = r->x0;
    w->field50 = r->y0;
    w->field54 = r->x1;
    w->field58 = r->y1;
}
extern inline void Win27_Close(Panel *w) {
    if (w != ((void *)0) && !(w->field28 & 2)) {
        D_8017C384(w);
    }
}
s32 func_0027FD7C(u16 msg, Task27 *t) {
    Obj27 *o = (Obj27 *)((u8 *)t + 0x18);
    u8 *sub = (u8 *)&o->w18;
    Rect27 a;
    Rect27 b;
    Rect27 r;
    Rect27 r2;
    Rect27 r3;
    s16 res;
    switch (msg) {
        case 0x11:
            func_0027CF50(t);
            break;
        case 0x10:
            (*(u8 * *)((u8 *)(t) + (0))) = D_8022CB84;
            o->w18 = (s32 *)D_8022D134;
            o->w14 = 0;
            o->h1C = 0;
            o->w24 = ((void *)0);
            o->w20 = ((void *)0);
            D_8022CB20 = o;
            D_8022CB28 = 0;
            t->state = 0x100;
            o->h1E ^= o->h1E; /* retail loads the field and xors it (lhu/xor/sh); "= 0" is two instructions shorter */
            break;
        case 0x100:
            a = D_8022D098;
            b = D_8022D098;
            a.y0 = b.y0 = 0xCD;
            a.y1 = b.y1 = 0xE1;
            b.x0 = a.x0 = a.x1 = 0x1E;
            b.x1 = 0x74;
            o->w20 = D_8017BFB0(2, 0, func_002803C0, a.x0, a.y0, a.x1, a.y1, b.x0, b.y0, b.x1, b.y1);
            t->state = 0x109;
            break;
        case 0x102:
            r = D_8022D0A0;
            r2 = D_8022D098;
            res = func_0027F778(o);
            if (res == 0) {
                t->state = 0x10B;
                break;
            }
            r.x1 = o->x + o->w;
            if (o->win == ((void *)0)) {
                o->win = D_8017BFB0(0x401, 0, o->fn, r.x0, r.y0, r.x1, r.y1, o->x, o->y, (s16)(o->x + o->w),
                                       (s16)(o->y + o->h));
            }
            r.x1 = r.x0 + o->w;
            Win27_SetRect4C((Panel *)o->win, &r);
            r2.y0 = o->y - 0x19;
            r2.y1 = o->y - 5;
            r2.x0 = o->x;
            r2.x1 = r2.x0 + 0x56;
            Win27_MoveTo((Panel *)o->w20, &r2.x0);
            r2.x0 = r2.x1 = 10;
            Win27_SetRect4C((Panel *)o->w20, &r2);
            t->hE = 9;
            t->hC = 0x103;
            t->state = 0;
            break;
        case 0x103:
            res = func_0027E8B0(o);
            D_8022CB28 = 1;
            if (res == 1) {
                D_800EA604((SoundChannel *)D_800EB1F0, 0);
                t->state = 0x10A;
            } else if (res == 2) {
                D_800EA604((SoundChannel *)D_800EB1F0, 1);
                t->state = 0x10B;
            } else if (res == 3) {
                D_800EA604((SoundChannel *)D_800EB1F0, 9);
                t->state = 0x10C;
            }
            break;
        case 0x106:
            Win27_Close((Panel *)o->w24);
            Win27_Close((Panel *)o->win);
            t->hE = 3;
            t->hC = 0x107;
            t->state = 0;
            break;
        case 0x107:
            r3 = D_8022D098;
            r3.y0 = 0xCD;
            r3.y1 = 0xE1;
            r3.x0 = 0x1E;
            r3.x1 = 0x74;
            Win27_MoveTo((Panel *)o->w20, &r3.x0);
            r3.x0 = r3.x1 = 10;
            Win27_SetRect4C((Panel *)o->w20, &r3);
            t->state = 0x109;
            break;
        case 0x108:
            Win27_Close((Panel *)o->w24);
            Win27_Close((*(Panel * *)((u8 *)(sub) + (8))));
            Win27_Close((Panel *)o->win);
            t->hE = 0xF;
            t->hC = 0x11;
            t->state = 0;
            break;
        case 0x109:
        case 0x10A:
        case 0x10B:
        case 0x10C:
            break;
    }
    o->win = D_8017F334(0x401);
    o->w20 = D_8017F334(2);
    o->w24 = D_8017F334(4);
    return 0;
}
void func_002803C0(Panel *panel, int selector);
