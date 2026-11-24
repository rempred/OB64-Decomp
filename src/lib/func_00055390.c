#include "game/cutscene_panels.h"
typedef Panel Node;
extern u8 D_801936E0;

Node *func_000552c0(void);
void D_80221354(void);
extern u8 D_80196AEC;
int func_00055454(Node *n);
extern inline Node *func_000552c0(void) {
    Node *n;
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
extern inline Node *func_00055308(void) {
    Node *n;
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
        n = n->link00;
        if (n == D_8018FDC0->link04) {
            n = ((void *)0);
        }
    }
    return n;
}
int func_00055390(void) {
    if (D_801936E0 && (D_80196AEC & 0x80)) {
        D_80221354();
    }
    return func_00055454(func_00055308());
}
