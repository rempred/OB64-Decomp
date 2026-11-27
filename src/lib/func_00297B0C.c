typedef struct Node296 {
    struct Node296 *prev;
    struct Node296 *next;
} Node296;
extern Node296 *D_8018FDC0;
void func_00297B0C(Node296 *n) {
    if (D_8018FDC0->next != n) {
        Node296 *nx = n->next;
        Node296 *pv = n->prev;
        if (nx != ((void *)0)) {
            nx->prev = pv;
        }
        pv->next = nx;
        n->prev = ((void *)0);
        n->next = D_8018FDC0->next;
        D_8018FDC0->next->prev = n;
        D_8018FDC0->next = n;
    }
}
