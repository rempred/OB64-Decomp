#include "game/task27_object.h"

typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_0027F0EC(Obj27 *o);
void func_0027EEE0(Obj27 *o);
void func_0027F234(Obj27 *o);
void func_0027F3EC(Obj27 *o);
void func_00280460(Panel *panel, int selector) {
    Gfx *g = gTitleCardDisplayListCursor;
    Obj27 *o = D_8022CB20;
    u8 *q;
    g->w0 = 0xFA000000;
    q = (u8 *)o->win;
    gTitleCardDisplayListCursor = g + 1;
    g->w1 = q[0x19] | 0xFFFFFF00;
    func_0027F0EC(o);
    func_0027EEE0(D_8022CB20);
    func_0027F234(D_8022CB20);
    func_0027F3EC(D_8022CB20);
}
