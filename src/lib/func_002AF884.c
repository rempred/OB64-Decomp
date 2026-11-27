typedef unsigned char u8;
typedef signed int s32;
void *func_000016C4(void *ptr);
typedef struct Link2AE {
    u8 unk00[0xC];
    struct Link2AE *next;
} Link2AE;
void func_002AF884(u8 *o) {
    void *list[64];
    Link2AE *p = (Link2AE *)(o + 8);
    s32 n;
    s32 i;
    if (o != ((void *)0)) {
        if (o[0] == 'B' && o[1] == '5') {
            n = 0;
            while (p->next != ((void *)0)) {
                list[n++] = p->next;
                p = p->next;
            }
            for (i = 0; i < n; i++) {
                func_000016C4(list[i]);
            }
        }
        func_000016C4(o);
    }
}
