#include "game/cutscene_panels.h"



typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct {
    u8 unk00[0x18];
    s32 *w18;
    s16 h1C;
    s16 h1E;
    u8 *w20;
    Panel *w24;
    s16 h28;
} Obj27;
extern Gfx *gTitleCardDisplayListCursor;
extern Obj27 *D_8022CB20;
void func_0027EA38(Obj27 *o);
void func_00280410(Panel *panel, int selector) {
    Obj27 *o = D_8022CB20;
    Gfx *g = gTitleCardDisplayListCursor;
    g->w0 = 0xFA000000;
    gTitleCardDisplayListCursor = g + 1;
    g->w1 = ((u8 *)o->w24)[0x19] | 0xFFFFFF00;
    func_0027EA38(o);
}
