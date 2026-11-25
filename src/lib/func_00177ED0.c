typedef unsigned char u8;
extern u8 *D_80218D80;
void D_8017C384(void *w);
void func_00177ED0(void) {
    if (D_80218D80 != ((void *)0)) {
        D_8017C384(D_80218D80);
        D_80218D80 = ((void *)0);
    }
}
