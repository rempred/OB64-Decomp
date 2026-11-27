struct Panel;
typedef unsigned char u8;
typedef signed int s32;
extern void *D_80219678[2];
void D_8017C384(struct Panel *);
extern void *D_8021967C;
extern s32 D_8021966C;
extern u8 D_80210219;
extern s32 D_80219630;
void func_001A5B70(void) {
    s32 pad[4];
    if (D_80219678[0] != ((void *)0)) {
        D_8017C384(D_80219678[0]);
    }
    if (D_80219630 != -1) {
        D_8017C384(D_8021967C);
    }
    D_8021966C = 0;
    D_80210219 = 0x11;
}
