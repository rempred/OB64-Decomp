typedef unsigned char u8;
void *func_000016C4(void *ptr);
extern u8 *D_8022A974;
void func_002A5CA0(void) {
    void **p = (*(void ** *)((u8 *)(D_8022A974) + (0x14)));
    if (p != ((void *)0)) {
        func_000016C4(p[0]);
        func_000016C4(p[2]);
        func_000016C4(p[1]);
        func_000016C4(p);
        (*(void ** *)((u8 *)(D_8022A974) + (0x14))) = ((void *)0);
    }
}
