typedef unsigned char u8;
void *func_000016C4(void *ptr);
extern void **D_801ED5C0;
extern void *D_801ED5B8;
extern void *D_801ED5BC;
extern u8 D_8018F53C;
void func_00135E34(void) {
    if (D_801ED5C0 != ((void *)0)) {
        func_000016C4(D_801ED5C0[0]);
        func_000016C4(D_801ED5C0[1]);
        func_000016C4(D_801ED5C0[2]);
        func_000016C4(D_801ED5C0[37]);
        func_000016C4(D_801ED5C0[38]);
        func_000016C4(D_801ED5C0);
        func_000016C4(D_801ED5B8);
        D_801ED5B8 = ((void *)0);
        func_000016C4(D_801ED5BC);
        D_801ED5BC = ((void *)0);
        D_801ED5C0 = ((void *)0);
        D_8018F53C = 0;
    }
}
