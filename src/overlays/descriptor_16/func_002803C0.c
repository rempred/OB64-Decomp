#include "game/task27_object.h"

typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_0027EC18(Obj27 *o);
void func_002803C0(Panel *panel, int selector) {
    Obj27 *o = D_8022CB20;
    Gfx *g = gTitleCardDisplayListCursor;
    g->w0 = 0xFA000000;
    gTitleCardDisplayListCursor = g + 1;
    g->w1 = ((unsigned char *)o->w20)[0x19] | 0xFFFFFF00;
    func_0027EC18(o);
}
