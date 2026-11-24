typedef unsigned char u8;
typedef unsigned short u16;
void *func_000016C4(void *ptr);
typedef struct Node {
    struct Node *prev;
    struct Node *next;
    u8 unk08[0xE];
    u16 id;
} Node;
extern Node *D_8018FDC0;
void func_00051e10(void) {
    Node *n;
    Node *t;
    Node *h;
    if (D_8018FDC0 == ((void *)0)) {
        return;
    }
    n = D_8018FDC0->next;
    while (n != ((void *)0)) {
        t = n;
        if ((*(void * *)((u8 *)(n) + (0xD0))) != ((void *)0)) {
            func_000016C4((*(void * *)((u8 *)(n) + (0xD0))));
        }
        n = n->next;
        func_000016C4(t);
    }
    func_000016C4((*(void * *)((u8 *)(D_8018FDC0) + (0xCC))));
    func_000016C4((*(void * *)((u8 *)(D_8018FDC0) + (0xC8))));
    h = D_8018FDC0;
    (*(u16 *)((u8 *)(h) + (0))) = 0;
    h->next = ((void *)0);
    func_000016C4(h);
    D_8018FDC0 = ((void *)0);
}
