typedef signed int s32;
typedef struct Node2A4 {
    struct Node2A4 *prev;
    struct Node2A4 *next;
} Node2A4;
extern Node2A4 *D_8018FDC0;
s32 func_002A6118(Node2A4 *n) {
    Node2A4 *p = D_8018FDC0->next;
    s32 r = 0;
    while (p != ((void *)0)) {
        if (p == n) {
            r = 1;
            break;
        }
        p = p->next;
    }
    return r;
}
