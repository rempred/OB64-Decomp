#include "game/cutscene_panels.h"

extern PanelList *D_8018FDC0_ovl_040E80;
Panel *func_000552c0(void);
void func_000521fc(Panel *n);
void func_00051dd4(void) {
    Panel *n = func_000552c0();
    if (n != ((void *)0)) {
        do {
            func_000521fc(n);
            n = func_000552c0();
        } while (n != ((void *)0));
    }
}
void func_000521fc(Panel *n);
extern inline Panel *func_000552c0(void) {
    Panel *n;
    if (D_8018FDC0_ovl_040E80 == ((void *)0)) {
        return ((void *)0);
    }
    n = D_8018FDC0_ovl_040E80->link04;
    if (n != ((void *)0) && n->link04 != ((void *)0)) {
        do {
            n = n->link04;
        } while (n->link04 != ((void *)0));
    }
    return n;
}
