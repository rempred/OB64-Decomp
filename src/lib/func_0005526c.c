#include "game/cutscene_panels.h"

Panel *func_0005526c(u16 id) {
    Panel *n;
    Panel *r = ((void *)0);
    for (n = D_8018FDC0->link04; n != ((void *)0); n = n->link04) {
        if (!(n->field16 & 0xFF00) && (n->field16 & 0xFF) == id) {
            r = n;
        } else if ((n->field16 & 0xFF00) == id) {
            r = n;
        }
    }
    return r;
}
