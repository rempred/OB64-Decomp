#include "game/cutscene_panels.h"
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
typedef Panel Win28;
void D_8017D6D0(Win28 *w, u8 a, u8 b, u8 c, s32 d, s32 e, s32 f);
void func_00291854(Win28 *w) {
    PanelContent *t = w->content;
    if (w->field18 != 0) {
        u8 last = t->field5F5 - 1;
        s32 y = w->field34 - 4;
        s32 x = w->field30 + 4;
        s32 width = w->field38 - 12;
        u8 first = t->field5F4;
        u8 a = t->field5F1;
        if (first < last) {
            Gfx *g = gTitleCardDisplayListCursor++;
            g->w0 = 0xFA000000;
            g->w1 = ((u8 *)w)[0x19] | 0xFFFFFF00;
            D_8017D6D0(w, a, first, last, y, x, width);
        }
    }
}
