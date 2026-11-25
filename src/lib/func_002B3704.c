typedef unsigned char u8;
void *func_000016C4(void *ptr);
extern u8 *D_8022A970;
void func_002B3704(void) {
    if (D_8022A970 != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(D_8022A970) + (0x4C))));
        func_000016C4((*(void * *)((u8 *)(D_8022A970) + (0x50))));
        func_000016C4(D_8022A970);
        D_8022A970 = ((void *)0);
    }
}
