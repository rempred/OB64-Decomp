typedef unsigned char u8;
typedef unsigned int u32;
void *func_000016C4(void *ptr);
extern u8 *D_801B81B0;
void func_001D508C(void);
void func_001D143C(void);
void func_001CF9C0(void);
void func_001D7FD4(void) {
    u32 i;
    func_001D508C();
    for (i = 0; i < 13; i++) {
        u8 *b = D_801B81B0;
        void **p = (void **)(b + (0x6C0 + i * 0x10));
        func_000016C4(*p);
        *p = ((void *)0);
    }
    func_001D143C();
    func_000016C4(D_801B81B0);
    D_801B81B0 = ((void *)0);
    func_001CF9C0();
}
