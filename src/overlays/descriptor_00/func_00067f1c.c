typedef signed int s32;
typedef unsigned int u32;
void * func_00001330(unsigned int);
void *func_000016C4(void *ptr);
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
extern s32 D_8018FC14;
s32 func_00067da4(u32 v);
void func_00067f1c(s32 k) {
    u32 *tab = func_00001330(D_8009DAF4(0x16B3D18));
    u32 *p;
    D_8009DBB8(tab, 0x16B3D18);
    p = D_8009DBB8(((void *)0), tab[k]);
    func_000016C4(tab);
    D_8018FC14 = func_00067da4(*p);
    func_000016C4(p);
}
