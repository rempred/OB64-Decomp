#include "game/cutscene_panels.h"

Panel *func_00055234(u16 id) {
    Panel *found = ((void *)0);
    Panel *n;
    for (n = D_8018FDC0->link04; n != ((void *)0); n = n->link04) {
        if (n->field16 == id) {
            found = n;
        }
    }
    return found;
}
