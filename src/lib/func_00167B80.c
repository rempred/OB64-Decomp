typedef unsigned char u8;
typedef unsigned short u16;
typedef struct Node165 {
    struct Node165 *prev;
    struct Node165 *next;
    u8 pad[0xE];
    u16 id;
} Node165;
extern Node165 *D_8018FDC0;
extern inline Node165 *Find165(u16 id) {
    Node165 *r = ((void *)0);
    Node165 *p;
    for (p = D_8018FDC0->next; p != ((void *)0); p = p->next) {
        if (p->id == id) {
            r = p;
            break;
        }
    }
    return r;
}
void func_00167B80(u16 id, Node165 *n) {
    Node165 *q = Find165(id);
    Node165 *qp;
    Node165 *np;
    Node165 *qn;
    Node165 *nn;
    if (q == ((void *)0) || q->next == ((void *)0)) {
        return;
    }
    if (D_8018FDC0->next == q) {
        D_8018FDC0->next = n;
    }
    qp = q->prev;
    np = n->prev;
    qn = q->next;
    nn = n->next;
    n->prev = qp;
    if (np == q) {
        n->next = q;
        q->next = nn;
        q->prev = n;
    } else {
        n->next = qn;
        q->next = nn;
        q->prev = np;
        qn->prev = n;
        np->next = q;
    }
    if (qp != ((void *)0)) {
        qp->next = n;
    }
    if (nn != ((void *)0)) {
        nn->prev = q;
    }
}
