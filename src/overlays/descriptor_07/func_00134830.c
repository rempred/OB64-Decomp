#include "game/panel_constructor.h"





typedef struct {
    s32 id;
    u8 unk04[8];
    s32 x2;
    s32 y2;
    s32 w2;
    s32 h2;
    s32 x;
    s32 y;
    s32 w;
    s32 h;
    Panel *win;
    u8 unk30[8];
    void *a;
    s32 b;
    s32 c;
    u8 unk44[0x1D];
    s8 d;
} Dialog134;
extern Dialog134 D_801ED540;
extern s32 D_801F0B40;
extern u16 *D_801F0CA0;
extern u16 *D_800C4BDC;
void func_0013511C(Dialog134 *d);
void func_00134CD4();

void D_8017C384(Panel *w);
void D_8020CDA0(s32 se);
s32 func_00134830(s32 id, void *a, s32 b, s32 c, s32 d, s32 x2) {
    if (D_801ED540.id == -1) {
        D_801ED540.d = d;
        D_801ED540.id = id;
        D_801ED540.a = a;
        D_801ED540.b = b;
        D_801ED540.c = c;
        D_801F0B40 = 0;
        D_801ED540.x2 = x2;
        func_0013511C(&D_801ED540);
        D_801ED540.win = D_8017BFB0(4, 0, func_00134CD4, D_801ED540.x,
                                                  D_801ED540.y, D_801ED540.w,
                                                  D_801ED540.h, D_801ED540.x2,
                                                  D_801ED540.y2, D_801ED540.w2,
                                                  D_801ED540.h2);
        return 2;
    }
    if ((*(u16 *)((u8 *)(D_801ED540.win) + (0x26))) == 0) {
        if ((*D_800C4BDC & D_801F0CA0[0]) || (*D_800C4BDC & D_801F0CA0[1])) {
            D_8020CDA0(6);
            D_8017C384(D_801ED540.win);
            D_801ED540.id = -1;
            return (*D_800C4BDC & D_801F0CA0[0]) ? 1 : 3;
        }
    }
    return 2;
}
