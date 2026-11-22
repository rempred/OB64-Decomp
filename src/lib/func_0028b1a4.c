#include "game/cutscene_panels.h"

void *func_000016C4(void *p);
void func_0028b1a4(void) {
    Panel *n;
    Panel *cur;
    if (D_8018FDC0 != ((void *)0)) {
        n = D_8018FDC0->link04;
        while (n != ((void *)0)) {
            cur = n;
            if (cur->content != ((void *)0)) {
                func_000016C4(cur->content);
            }
            n = cur->link04;
            func_000016C4(cur);
        }
        D_8018FDC0->count = 0;
        D_8018FDC0->link04 = ((void *)0);
    }
}
