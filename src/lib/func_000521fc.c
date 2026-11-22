#include "game/cutscene_panels.h"

void func_000521fc(Panel *n);
void *func_000016C4(void *p);
void func_000521fc(Panel *n) {
    Panel *next;
    Panel *prev;
    if (n->content != ((void *)0)) {
        func_000016C4(n->content);
    }
    next = n->link04;
    prev = n->link00;
    if (next != ((void *)0)) {
        next->link00 = prev;
    }
    if (D_8018FDC0->link04 == n) {
        D_8018FDC0->link04 = next;
    } else {
        prev->link04 = n->link04;
    }
    D_8018FDC0->count--;
    if (n != ((void *)0)) {
        func_000016C4(n);
    }
}
