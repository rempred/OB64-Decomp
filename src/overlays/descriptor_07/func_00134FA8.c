#include "game/dialog134.h"
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
void bcopy(void *src, void *dst, s32 n);
void bzero(void *p, s32 n);
void D_80179034(void *, int, int);
void D_8017C4B4(int a);
void D_801818A0(s32 x, s32 y);
extern Gfx *gTitleCardDisplayListCursor;
extern signed char *D_801ED584;
extern signed char *D_801ED588;
extern s32 D_801ED598;
extern s32 D_801ED59C;
extern u8 D_801ED5A0;
extern u8 D_801ED5A4;
typedef struct { u8 pad[0x18]; s16 page; } Page134;
void func_00134FA8(Panel *o, s32 i) {
    Page134 *p = (Page134 *)(i * 2 + (s32)o);
    if (p->page != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        s32 tx, ty;
        signed char buf[0x100];
        gTitleCardDisplayListCursor->w0 = 0xE7000000;
        gTitleCardDisplayListCursor->w1 = 0;
        gTitleCardDisplayListCursor++;
        ty = y + 1;
        D_8017C4B4((s16)p->page);
        bzero(buf, 0x100);
        bcopy(D_801ED584, buf, D_801ED598);
        tx = x + 0x17;
        D_80179034(buf, tx, ty);
        bzero(buf, 0x100);
        ty = y + 0x10;
        bcopy(D_801ED588, buf, D_801ED59C);
        D_80179034(buf, tx, ty);
        D_801818A0(x + (D_801ED5A4 & 0xF) - 1, ty + (D_801ED5A0 - 1) * 15 + 2);
        if (D_801ED5A4 & 0xF0) {
            D_801ED5A4++;
            if ((D_801ED5A4 & 0xF) >= 5) {
                D_801ED5A4 &= 0xF;
            }
        } else {
            D_801ED5A4--;
            if (!(D_801ED5A4 & 0xF)) {
                D_801ED5A4 |= 0xF0;
            }
        }
    }
}
