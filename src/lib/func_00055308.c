#include "game/cutscene_panels.h"

Panel *func_000552c0(void);
extern inline Panel *func_000552c0(void) {
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
inline Panel *func_00055308(void) {
    Panel *n;
    if (D_8018FDC0 == ((void *)0)) {
        return ((void *)0);
    }
    if (D_8018FDC0->link04 == ((void *)0)) {
        return ((void *)0);
    }
    n = func_000552c0();
    while (n != ((void *)0)) {
        if (!((*(u8 *)((u8 *)(n) + (0x14))) & 0x10)) {
            return n;
        }
        n = (n->link00 != D_8018FDC0->link04) ? n->link00 : ((void *)0);
    }
    return n;
}
