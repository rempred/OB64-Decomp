typedef signed int s32;
typedef unsigned int u32;
void *func_000016C4(void *ptr);
extern void *D_8019C8D0[];
void D_80079618(s32 a, ...);
void D_80229B18(void);
void D_80229930(void);
void D_80228378(void);
void D_80224E1C(void);
void func_0006ce04(void) {
    u32 i;
    D_80079618(0x21C3C38, -0x11);
    D_80229B18();
    D_80229930();
    D_80228378();
    D_80224E1C();
    for (i = 0; i < 4; i++) {
        func_000016C4(D_8019C8D0[i]);
        D_8019C8D0[i] = ((void *)0);
    }
}
