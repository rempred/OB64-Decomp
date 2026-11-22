#include "game/cutscene_panels.h"

Panel *func_000552c0(void);
inline Panel *func_000552c0(void) {
    Panel *n;
    if (D_8018FDC0 == ((void *)0)) {
        return ((void *)0);
    }
    n = D_8018FDC0->link04;
    if (n != ((void *)0) && n->link04 != ((void *)0)) {
        do {
            n = n->link04;
        } while (n->link04 != ((void *)0));
    }
    return n;
}
